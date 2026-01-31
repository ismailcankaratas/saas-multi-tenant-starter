import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) { }

    // ✅ Tenant bazlı role oluştur
    async createRole(tenantId: string, name: string, description?: string) {
        // Aynı tenant içinde role adı unique (schema'de @@unique([tenantId,name]))
        try {
            return await this.prisma.role.create({
                data: {
                    tenantId,
                    name,
                    description,
                    isSystem: false,
                },
            });
        } catch (e: any) {
            // Prisma unique violation P2002 vs.
            throw new BadRequestException('Role name already exists in this tenant');
        }
    }

    // ✅ Tenant içindeki rolleri listele
    async listRoles(tenantId: string) {
        return this.prisma.role.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
            include: {
                grants: {
                    include: { permission: true },
                },
            },
        });
    }

    // ✅ Role'a permission set et (replace)
    async assignPermissionsToRole(tenantId: string, roleId: string, permissionIds: string[]) {
        const role = await this.prisma.role.findUnique({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');

        // Tenant izolasyonu
        if (role.tenantId !== tenantId) throw new ForbiddenException('Role belongs to another tenant');

        // System role'ları kilitlemek istersen:
        // if (role.isSystem) throw new ForbiddenException('System roles cannot be modified');

        // Permission ID'leri gerçekten var mı? (opsiyonel ama iyi)
        const perms = await this.prisma.permission.findMany({
            where: { id: { in: permissionIds } },
            select: { id: true },
        });

        if (perms.length !== permissionIds.length) {
            throw new BadRequestException('One or more permissionIds are invalid');
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({ where: { roleId } });
            await tx.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({
                    roleId,
                    permissionId,
                })),
            });
        });

        return { success: true };
    }

    // ✅ TenantUser'a role ata
    async assignRoleToTenantUser(tenantId: string, tenantUserId: string, roleId: string) {
        // membership bu tenant'a mı?
        const membership = await this.prisma.tenantUser.findUnique({
            where: { id: tenantUserId },
            select: { id: true, tenantId: true },
        });
        if (!membership) throw new NotFoundException('Tenant user not found');
        if (membership.tenantId !== tenantId) throw new ForbiddenException('User belongs to another tenant');

        // role bu tenant'a mı?
        const role = await this.prisma.role.findUnique({
            where: { id: roleId },
            select: { id: true, tenantId: true },
        });
        if (!role) throw new NotFoundException('Role not found');
        if (role.tenantId !== tenantId) throw new ForbiddenException('Role belongs to another tenant');

        // duplicate engelle (composite id)
        try {
            return await this.prisma.tenantUserRole.create({
                data: { tenantUserId, roleId },
            });
        } catch (e: any) {
            // zaten varsa
            return { success: true, message: 'Already assigned' };
        }
    }

    // ✅ TenantUser'dan role kaldır
    async removeRoleFromTenantUser(tenantId: string, tenantUserId: string, roleId: string) {
        // membership & role tenant kontrolü
        const [membership, role] = await Promise.all([
            this.prisma.tenantUser.findUnique({ where: { id: tenantUserId }, select: { tenantId: true } }),
            this.prisma.role.findUnique({ where: { id: roleId }, select: { tenantId: true, isSystem: true, name: true } }),
        ]);

        if (!membership) throw new NotFoundException('Tenant user not found');
        if (!role) throw new NotFoundException('Role not found');

        if (membership.tenantId !== tenantId) throw new ForbiddenException('User belongs to another tenant');
        if (role.tenantId !== tenantId) throw new ForbiddenException('Role belongs to another tenant');

        // OWNER rolünü kaldırtmak istemezsen (opsiyonel kural)
        if (role.isSystem && role.name === 'OWNER') {
            throw new ForbiddenException('OWNER role cannot be removed');
        }

        await this.prisma.tenantUserRole.delete({
            where: {
                tenantUserId_roleId: { tenantUserId, roleId },
            },
        });

        return { success: true };
    }
}
