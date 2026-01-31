import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: String(process.env.JWT_ACCESS_SECRET),
        });
    }

    async validate(payload: any) {
        /**
         * payload = {
         *   sub: userId,
         *   tenantId,
         *   roles,
         *   permissions,
         *   iat,
         *   exp
         * }
         */

        if (!payload?.sub || !payload?.tenantId) {
            throw new UnauthorizedException('Invalid token payload');
        }

        return {
            sub: payload.sub,
            tenantId: payload.tenantId,
            roles: payload.roles || [],
            permissions: payload.permissions || [],
        };
    }
}
