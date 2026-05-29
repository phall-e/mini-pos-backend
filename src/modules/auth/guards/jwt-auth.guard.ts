import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../services/token.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private tokenService: TokenService,
        private reflector: Reflector,
    ){
        super();
    }

    canActivate(context: ExecutionContext) {
        const isSkipAuth = this.reflector.get<boolean>('skipAuth', context.getHandler());
        if (isSkipAuth) {
            return true;
        }
        return super.canActivate(context);
    }

    handRequest(error, user, info) {
        if (error || !user) {
            throw error || new UnauthorizedException();
        }
        return user;
    }
}