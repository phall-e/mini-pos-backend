import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { ApiForbiddenResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { VerfiyOtpRequestDto } from './dto/verify-otp-request.dto';
import { OtpResponseDto } from './dto/otp-response.dto';

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
    public login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.authService.login(dto);
    }

    @Post('otp-verify')
    @SkipAuth()
    @ApiResponse({ status: 201, type: OtpResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unuthorized' })
    @ApiForbiddenResponse({ description: 'Invalid OTP Code' })
    public otpVerify(@Body() dto: VerfiyOtpRequestDto): Promise<OtpResponseDto> {
        return this.authService.verifyOtp(dto);
    }
}
