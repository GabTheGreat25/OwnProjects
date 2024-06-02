import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { TokenService } from "./middleware.verifyToken";
import { ENV } from "src/config";
import { RESOURCE } from "src/constants";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    return token
      ? !this.tokenService.isTokenBlacklisted()
        ? (() => {
            request.user = this.jwtService.verify(token, {
              secret: ENV.ACCESS_TOKEN_SECRET,
            });
            const requiredRoles = this.reflector.get<string[]>(
              RESOURCE.ROLES,
              context.getHandler(),
            );
            if (!requiredRoles || requiredRoles.includes(request.user.role)) {
              return true;
            } else
              throw new UnauthorizedException(
                `Roles ${request.user.role} are not allowed to access this resource`,
              );
          })() || false
        : (() => {
            throw new UnauthorizedException("Token is expired");
          })()
      : (() => {
          throw new UnauthorizedException("Please login First");
        })();
  }
}
