import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AssignPermissionsDto {
    @IsString()
    roleId: string;

    @IsArray()
    @ArrayNotEmpty()
    permissionIds: string[];
}
