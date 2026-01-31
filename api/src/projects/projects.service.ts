import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    create(tenantId: string, name: string) {
        return this.prisma.project.create({
            data: { tenantId, name },
        });
    }

    findAll(tenantId: string) {
        return this.prisma.project.findMany({
            where: { tenantId },
        });
    }
}
