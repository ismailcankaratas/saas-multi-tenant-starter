import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const user = request.user;
        if (!user?.tenantId) {
            throw new ForbiddenException('Tenant context missing');
        }

        /**
         * Burada ileride:
         * - X-Tenant-Id header
         * - subdomain
         * - route param
         * gibi kontroller eklenebilir
         */

        // Şimdilik token’daki tenantId bizim source of truth
        request.tenantId = user.tenantId;

        return true;
    }
}
