import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RemoveRoleDto } from './dto/remove-role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class RolesController {
    constructor(private roles: RolesService) { }

    // ✅ Role oluştur (tenant scoped)
    @Post()
    @RequirePermission('role.create')
    create(@Req() req: any, @Body() dto: CreateRoleDto) {
        return this.roles.createRole(req.tenantId, dto.name, dto.description);
    }

    // ✅ Role listele
    @Get()
    @RequirePermission('role.read')
    list(@Req() req: any) {
        return this.roles.listRoles(req.tenantId);
    }

    // ✅ Role'a permission set et
    @Post('assign-permissions')
    @RequirePermission('role.update')
    assignPermissions(@Req() req: any, @Body() dto: AssignPermissionsDto) {
        return this.roles.assignPermissionsToRole(req.tenantId, dto.roleId, dto.permissionIds);
    }

    // ✅ User'a role ata
    @Post('assign-user')
    @RequirePermission('role.assign')
    assignUser(@Req() req: any, @Body() dto: AssignRoleDto) {
        return this.roles.assignRoleToTenantUser(req.tenantId, dto.tenantUserId, dto.roleId);
    }

    // ✅ User'dan role kaldır
    @Post('remove-user')
    @RequirePermission('role.assign')
    removeUser(@Req() req: any, @Body() dto: RemoveRoleDto) {
        return this.roles.removeRoleFromTenantUser(req.tenantId, dto.tenantUserId, dto.roleId);
    }
}
