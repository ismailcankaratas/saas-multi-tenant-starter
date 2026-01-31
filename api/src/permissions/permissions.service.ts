import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
    constructor(private prisma: PrismaService) { }

    async create(key: string, description: string) {
        const exists = await this.prisma.permission.findUnique({
            where: { key },
        });

        if (exists) {
            throw new BadRequestException('Permission already exists');
        }

        return this.prisma.permission.create({
            data: { key, description },
        });
    }

    findAll() {
        return this.prisma.permission.findMany({
            orderBy: { key: 'asc' },
        });
    }
}
