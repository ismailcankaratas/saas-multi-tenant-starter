import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermission = this.reflector.get<string>(
            PERMISSION_KEY,
            context.getHandler(),
        );

        if (!requiredPermission) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // OWNER rolüne sahip kullanıcılar tüm izinlere sahiptir
        if (user?.roles?.includes('OWNER')) {
            return true;
        }

        if (!user?.permissions?.includes(requiredPermission)) {
            throw new ForbiddenException('Permission denied');
        }

        return true;
    }
}
