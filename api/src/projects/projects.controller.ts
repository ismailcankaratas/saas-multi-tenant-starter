import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermission } from '../common/decorators/permission.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionGuard)
export class ProjectsController {
    constructor(private projects: ProjectsService) { }

    @Post()
    @RequirePermission('project.create')
    create(@Req() req: any, @Body('name') name: string) {
        return this.projects.create(req.tenantId, name);
    }

    @Get()
    @RequirePermission('project.read')
    findAll(@Req() req: any) {
        return this.projects.findAll(req.tenantId);
    }
}
