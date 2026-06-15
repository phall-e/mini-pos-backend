import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import {
  ApiForbiddenResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { VerfiyOtpRequestDto } from './dto/verify-otp-request.dto';
import { OtpResponseDto } from './dto/otp-response.dto';
import { LogActivityRequestMeta } from '@modules/admin/system/log-activity/decorators/log-activity-meta.decorator';
import type { LogActivityMeta } from '@modules/admin/system/log-activity/types/log-activity-meta.type';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unuthorized' })
  @ApiForbiddenResponse({ description: 'User is inactive' })
  public login(
    @Body() dto: LoginRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<LoginResponseDto | OtpResponseDto> {
    return this.authService.login(dto, logMeta);
  }

  @Post('otp-verify')
  @SkipAuth()
  @ApiResponse({ status: 201, type: OtpResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unuthorized' })
  @ApiForbiddenResponse({ description: 'Invalid OTP Code' })
  public otpVerify(
    @Body() dto: VerfiyOtpRequestDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<OtpResponseDto> {
    return this.authService.verifyOtp(dto, logMeta);
  }

  @Post('logout')
  @ApiResponse({ status: 201, type: LogoutResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unuthorized' })
  public logout(
    @CurrentUser() user: UserResponseDto,
    @LogActivityRequestMeta() logMeta: LogActivityMeta,
  ): Promise<LogoutResponseDto> {
    return this.authService.logout(user, logMeta);
  }
}
