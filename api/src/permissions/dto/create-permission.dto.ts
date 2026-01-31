import { IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    key: string; // örn: order.create

    @IsString()
    description: string;
}
