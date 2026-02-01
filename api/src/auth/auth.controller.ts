import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SelectTenantDto } from './dto/select-tenant.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { RequirePermission } from 'src/common/decorators/permission.decorator';
import { LogoutDto } from './dto/logout.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.auth.register(dto.email, dto.password, dto.tenantName, dto.tenantSlug);
    }

    // 1) email/pass -> tenant list
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.auth.login(dto.email, dto.password);
    }

    // 2) tenant seç -> token
    // Şimdilik userId'yi body ile almayalım; pratik olsun diye header/temporary çözüm.
    // Bir sonraki adımda "pre-auth token" veya session yaklaşımı ekleyeceğiz.
    @Post('select-tenant')
    async selectTenant(@Body() dto: SelectTenantDto, @Req() req: any) {
        const userId = req.headers['x-user-id']; // geçici
        return this.auth.selectTenant(String(userId), dto.tenantId);
    }

    @Post('refresh')
    refresh(@Body() dto: RefreshDto) {
        return this.auth.refresh(dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: any, @Body() dto: LogoutDto) {
        const userId = req.user.sub;
        return this.auth.logout(userId, dto.tenantId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: any) {
        const user = await this.auth.getUser(req.user.sub);
        const tenant = await this.auth.getTenant(req.user.tenantId);
        return {
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            tenantName: tenant.name,
            tenantSlug: tenant.slug,
            ...req.user,
        };
    }

    @Post('invite-user')
    @UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
    @RequirePermission('user.invite')
    async inviteUser(@Req() req: any, @Body() dto: InviteUserDto) {
        return this.auth.inviteUserToTenant(req.tenantId, dto.email, dto.roleId);
    }

    @Get('tenant-users')
    @UseGuards(JwtAuthGuard, TenantGuard)
    async listTenantUsers(@Req() req: any) {
        return this.auth.listTenantUsers(req.tenantId);
    }

    @Get('invitations')
    @UseGuards(JwtAuthGuard)
    async getInvitations(@Req() req: any) {
        return this.auth.getUserInvitations(req.user.sub);
    }

    @Post('accept-invitation')
    @UseGuards(JwtAuthGuard)
    async acceptInvitation(@Req() req: any, @Body() dto: RespondInviteDto) {
        return this.auth.acceptInvitation(req.user.sub, dto.membershipId);
    }

    @Post('decline-invitation')
    @UseGuards(JwtAuthGuard)
    async declineInvitation(@Req() req: any, @Body() dto: RespondInviteDto) {
        return this.auth.declineInvitation(req.user.sub, dto.membershipId);
    }
}
