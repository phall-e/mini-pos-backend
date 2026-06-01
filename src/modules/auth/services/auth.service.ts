import { UserService } from '@modules/admin/system/user/user.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { TokenService } from './token.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { PasswordHash } from '@libs/utils/password-hash.util';
import { handleError } from '@libs/utils/handle-error.util';
import { generateOpt } from '@libs/utils/otp-generator.util';
import { TelegramService } from '@telegram/telegram.service';
import { VerfiyOtpRequestDto } from '../dto/verify-otp-request.dto';
import { OtpResponseDto } from '../dto/otp-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private telegramService: TelegramService,
    ){}

    public async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) throw new UnauthorizedException();
            if (!user.isActive) throw new ForbiddenException('User is inactive');
            const isMatched = await PasswordHash.verify(dto.password, user.password);
            if (!isMatched) throw new UnauthorizedException();

            const opt = generateOpt();
            await this.userService.updateOtp(user.id, opt);
            await this.telegramService.sendMessage(
                user.telegramChatId,
                `Your OTP is ${opt}`,
            );

            return {
                success: true,
                username: user.username,
                status: 200,
                message: 'OTP sent to Telegram',
            };
        } catch (error) {
            handleError(error);
        }
    }

    public async verifyOtp(dto: VerfiyOtpRequestDto): Promise<OtpResponseDto> {
        try {
            const user = await this.userService.findOneByUsername(dto.username);
            if (!user) throw new UnauthorizedException();
            if (!user.otpCode) throw new UnauthorizedException();
            if (user.otpCode !== dto.otp) throw new UnauthorizedException();

            await this.userService.updateOtp(user.id, null); 

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
