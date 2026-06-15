import { UserService } from '@modules/admin/system/user/user.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { UserMapper } from '@modules/admin/system/user/user.mapper';
import { TokenService } from './token.service';
import { LoginResponseDto } from '../dto/login-response.dto';
import { PasswordHash } from '@libs/utils/password-hash.util';
import { handleError } from '@libs/utils/handle-error.util';
import { generateOpt } from '@libs/utils/otp-generator.util';
import { TelegramService } from '@modules/admin/system/telegram/telegram.service';
import { VerfiyOtpRequestDto } from '../dto/verify-otp-request.dto';
import { OtpResponseDto } from '../dto/otp-response.dto';
import { LogActivityService } from '@modules/admin/system/log-activity/log-activity.service';
import { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';
import { LogoutResponseDto } from '../dto/logout-response.dto';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private telegramService: TelegramService,
    private logActivityService: LogActivityService,
  ) {}

  public async login(
    dto: LoginRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<LoginResponseDto | OtpResponseDto> {
    try {
      const user = await this.userService.findOneByUsername(dto.username);
      if (!user) throw new UnauthorizedException();
      if (!user.isActive) throw new ForbiddenException('User is inactive');
      const isMatched = await PasswordHash.verify(dto.password, user.password);
      if (!isMatched) throw new UnauthorizedException();

      if (user.isRequiredOtp) {
        const opt = generateOpt();
        await this.userService.updateOtp(user.id, opt);
        await this.telegramService.sendMessage(
          user.telegramChatId,
          `Your OTP is ${opt}`,
        );

        await this.logActivityService.record({
          ...logMeta,
          userId: user.id,
          module: 'auth',
          action: 'login-otp-request',
          description: `request login OTP for User ${user.username}`,
        });

        return {
          success: true,
          username: user.username,
          status: 200,
          isRequiredOtp: user.isRequiredOtp,
          message: 'OTP sent to Telegram',
        };
      }

      const payload = await this.payloadGenerate(user.username);
      await this.logActivityService.record({
        ...logMeta,
        userId: user.id,
        module: 'auth',
        action: 'login',
        description: `login User ${user.username}`,
      });
      return payload;
    } catch (error) {
      handleError(error);
    }
  }

  public async verifyOtp(
    dto: VerfiyOtpRequestDto,
    logMeta?: LogActivityMeta,
  ): Promise<OtpResponseDto> {
    try {
      const user = await this.userService.findOneByUsername(dto.username);
      if (!user) throw new UnauthorizedException();
      if (!user.otpCode) throw new UnauthorizedException();
      if (user.otpCode !== dto.otp) throw new UnauthorizedException();

      await this.userService.updateOtp(user.id, null);

      const payload = await this.payloadGenerate(user.username);
      await this.logActivityService.record({
        ...logMeta,
        userId: user.id,
        module: 'auth',
        action: 'otp-verify',
        description: `verify login OTP for User ${user.username}`,
      });
      return payload;
    } catch (error) {
      handleError(error);
    }
  }

  public async logout(
    user: UserResponseDto,
    logMeta?: LogActivityMeta,
  ): Promise<LogoutResponseDto> {
    try {
      await this.logActivityService.record({
        ...logMeta,
        userId: user.id,
        module: 'auth',
        action: 'logout',
        description: `logout User ${user.username}`,
      });

      return {
        success: true,
        status: 200,
        message: 'Logged out successfully',
      };
    } catch (error) {
      handleError(error);
    }
  }

  private async payloadGenerate(username: string): Promise<OtpResponseDto> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) throw new UnauthorizedException();
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      isRequiredOtp: user.isRequiredOtp,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };

    const roles = await user.roles;
    const allPermissions = await Promise.all(
      roles
        .map((role) => role.permissions)
        .map(async (perm) => (await perm).flatMap((p) => p.name)),
    );
    const uniquePermissions = Array.from(new Set(allPermissions.flat()));
    const userMapped = await UserMapper.toDto(user);
    const userRoles = roles.map((item) => item.name);

    const token = await this.tokenService.generateAuthToken(payload);
    return {
      users: {
        ...userMapped,
        roles: userRoles,
        permissions: uniquePermissions,
      },
      token,
      IsRequiredOtp: user.isRequiredOtp,
    };
  }
}
