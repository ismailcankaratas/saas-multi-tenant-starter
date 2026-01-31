import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SelectTenantDto } from './dto/select-tenant.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.auth.register(dto.email, dto.password, dto.tenantName, dto.tenantSlug);
    }

    // 1) email/pass -> tenant list
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.auth.login(dto.email, dto.password);
    }

    // 2) tenant seç -> token
    // Şimdilik userId'yi body ile almayalım; pratik olsun diye header/temporary çözüm.
    // Bir sonraki adımda "pre-auth token" veya session yaklaşımı ekleyeceğiz.
    @Post('select-tenant')
    async selectTenant(@Body() dto: SelectTenantDto, @Req() req: any) {
        const userId = req.headers['x-user-id']; // geçici
        return this.auth.selectTenant(String(userId), dto.tenantId);
    }

    @Post('refresh')
    refresh(@Body() dto: RefreshDto) {
        return this.auth.refresh(dto.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req: any, @Body() dto: LogoutDto) {
        const userId = req.user.sub;
        return this.auth.logout(userId, dto.tenantId);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: any) {
        return req.user;
    }

}
