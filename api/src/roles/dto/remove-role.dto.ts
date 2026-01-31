import { IsString } from 'class-validator';

export class RemoveRoleDto {
    @IsString()
    tenantUserId: string;

    @IsString()
    roleId: string;
}
