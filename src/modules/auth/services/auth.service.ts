import { UserService } from '@modules/admin/system/user/user.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { TokenService } from './token.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { PasswordHash } from '@libs/utils/password-hash.util';
import { handleError } from '@libs/utils/handle-error.util';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private tokenService: TokenService,
    ){}

    public async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) throw new UnauthorizedException();
            if (!user.isActive) throw new ForbiddenException('User is inactive');
            const isMatched = await PasswordHash.verify(dto.password, user.password);
            if (!isMatched) throw new UnauthorizedException();
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
            };

            const roles = await user.roles;
            const allPermissions = await Promise.all(
                roles.map(role => role.permissions).map(async (perm) => (await perm).flatMap(p => p.name)),
            );
            const uniquePermissions = Array.from(new Set(allPermissions.flat()));
            const userMapped = await UserMapper.toDto(user);
            const userRoles = roles.map(item => item.name);


            const token = await this.tokenService.generateAuthToken(payload);
            return {
                users: {
                    ...userMapped,
                    roles: userRoles,
                    permissions: uniquePermissions,
                },
                token,
            };
        } catch (error) {
            handleError(error);
        }
    }
}
