import { IsString } from 'class-validator';

export class SelectTenantDto {
    @IsString()
    tenantId: string;
}
