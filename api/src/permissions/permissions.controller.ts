import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class PermissionsController {
    constructor(private permissions: PermissionsService) { }

    @Post()
    @RequirePermission('permission.create')
    create(@Body() dto: CreatePermissionDto) {
        return this.permissions.create(dto.key, dto.description);
    }

    @Get()
    @RequirePermission('permission.read')
    findAll() {
        return this.permissions.findAll();
    }
}
