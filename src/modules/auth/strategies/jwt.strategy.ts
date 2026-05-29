import { UserResponseDto } from "@modules/admin/system/user/dto/user-response.dto";
import { UserMapper } from "@modules/admin/system/user/user.mapper";
import { UserService } from "@modules/admin/system/user/user.service";
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: UserResponseDto): Promise<UserResponseDto> {
        
        const user = await this.userService.findOneByUsername(payload.username);
        const userMapper = UserMapper.toDtoWithRelationship(user);

        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (!user.isActive) throw new ForbiddenException('User is inactive');
        return userMapper;
    }
}