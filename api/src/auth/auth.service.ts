import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private redis: RedisService,
    ) { }

    private async hashPassword(password: string) {
        const saltRounds = 12;
        return bcrypt.hash(password, saltRounds);
    }

    private hashToken(token: string) {
        return createHash('sha256').update(token).digest('hex');
    }

    private async storeRefreshToken(
        userId: string,
        tenantId: string,
        refreshToken: string,
    ) {
        const hash = this.hashToken(refreshToken);
        const key = `refresh:${userId}:${tenantId}`;

        await this.redis
            .getClient()
            .set(key, hash, 'EX', 60 * 60 * 24 * 30); // 30 gün
    }


    async register(email: string, password: string, tenantName: string, tenantSlug: string) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) throw new BadRequestException('Email already in use');

        // slug unique
        const existingSlug = await this.prisma.tenant.findUnique({ where: { slug: tenantSlug } });
        if (existingSlug) throw new BadRequestException('Tenant slug already in use');

        const passwordHash = await this.hashPassword(password);

        // transaction: user + tenant + membership + owner role
        const result = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { email, passwordHash },
            });

            const tenant = await tx.tenant.create({
                data: { name: tenantName, slug: tenantSlug },
            });

            const membership = await tx.tenantUser.create({
                data: {
                    tenantId: tenant.id,
                    userId: user.id,
                    status: 'ACTIVE',
                },
            });

            // System role: OWNER
            const ownerRole = await tx.role.create({
                data: {
                    tenantId: tenant.id,
                    name: 'OWNER',
                    description: 'Tenant owner',
                    isSystem: true,
                },
            });

            await tx.tenantUserRole.create({
                data: {
                    tenantUserId: membership.id,
                    roleId: ownerRole.id,
                },
            });

            return { user, tenant, membership };
        });

        return {
            userId: result.user.id,
            tenantId: result.tenant.id,
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        return { id: user.id, email: user.email };
    }

    // Login 1: tenant list döndür
    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const memberships = await this.prisma.tenantUser.findMany({
            where: { userId: user.id, status: 'ACTIVE' },
            include: { tenant: true },
            orderBy: { createdAt: 'asc' },
        });

        return {
            user,
            tenants: memberships.map((m) => ({
                tenantId: m.tenantId,
                tenantName: m.tenant.name,
                tenantSlug: m.tenant.slug,
            })),
        };
    }

    // Login 2: tenant seçilince token üret
    async selectTenant(userId: string, tenantId: string) {
        const membership = await this.prisma.tenantUser.findFirst({
            where: { userId, tenantId, status: 'ACTIVE' },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                grants: { include: { permission: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!membership) throw new UnauthorizedException('No access to tenant');

        const roles = membership.roles.map((ur) => ur.role.name);
        const permissions = Array.from(
            new Set(
                membership.roles.flatMap((ur) =>
                    ur.role.grants.map((g) => g.permission.key),
                ),
            ),
        );

        const accessToken = await this.jwt.signAsync(
            { sub: userId, tenantId, roles, permissions } as any,
            { secret: String(process.env.JWT_ACCESS_SECRET), expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '15m') },
        );

        const refreshToken = await this.jwt.signAsync(
            { sub: userId, tenantId, type: 'refresh' } as any,
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '30d') },
        );

        await this.storeRefreshToken(userId, tenantId, refreshToken);

        // refresh token’ı bir sonraki adımda Redis/DB’de hash’leyip saklayacağız (revocation için).
        return { accessToken, refreshToken, roles, permissions };
    }

    async refresh(refreshToken: string) {
        const payload = await this.jwt.verifyAsync(refreshToken, {
            secret: String(process.env.JWT_REFRESH_SECRET),
        });

        const key = `refresh:${payload.sub}:${payload.tenantId}`;
        const storedHash = await this.redis.getClient().get(key);

        if (!storedHash) throw new UnauthorizedException('Token revoked');

        if (this.hashToken(refreshToken) !== storedHash) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const accessToken = await this.jwt.signAsync(
            {
                sub: payload.sub,
                tenantId: payload.tenantId,
                roles: payload.roles,
                permissions: payload.permissions,
            },
            {
                secret: String(process.env.JWT_ACCESS_SECRET),
                expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '15m'),
            },
        );

        return { accessToken };
    }

    async logout(userId: string, tenantId: string) {
        const key = `refresh:${userId}:${tenantId}`;
        await this.redis.getClient().del(key);
        return { success: true };
    }
}
