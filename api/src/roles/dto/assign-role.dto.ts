import { IsString } from 'class-validator';

export class AssignRoleDto {
    @IsString()
    tenantUserId: string;

    @IsString()
    roleId: string;
}
