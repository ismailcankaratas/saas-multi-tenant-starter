import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    // İlk tenant da oluşturacağız
    @IsString()
    @MinLength(2)
    tenantName: string;

    @IsString()
    @MinLength(2)
    tenantSlug: string;
}
