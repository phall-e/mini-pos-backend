import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { ApiForbiddenResponse, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { SkipAuth } from './decorators/skip-auth.decorator';

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
}
