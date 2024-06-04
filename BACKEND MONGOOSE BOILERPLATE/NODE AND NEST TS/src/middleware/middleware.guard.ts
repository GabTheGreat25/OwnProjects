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
import { RESOURCE, STATUSCODE } from "src/constants";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[STATUSCODE.ONE];

    return !token
      ? (() => {
          throw new UnauthorizedException("Access denied");
        })()
      : this.tokenService.getToken() !== token
        ? (() => {
            throw new UnauthorizedException("Invalid token");
          })()
        : this.tokenService.isTokenBlacklisted()
          ? (() => {
              throw new UnauthorizedException("Token is expired");
            })()
          : (() => {
              request.user = this.jwtService.verify(token, {
                secret: ENV.ACCESS_TOKEN_SECRET,
              });
              const requiredRoles = this.reflector.get<string[]>(
                RESOURCE.ROLES,
                context.getHandler(),
              );
              return !requiredRoles || requiredRoles.includes(request.user.role)
                ? true
                : (() => {
                    throw new UnauthorizedException(
                      `Roles ${request.user.role} are not allowed to access this resource`,
                    );
                  })();
            })();
  }
}
