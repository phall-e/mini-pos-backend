import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionGuard } from './guards/permissions.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/admin/system/user/user.module';
import { AuthController } from './auth.controller';
import { TelegramModule } from '@modules/admin/system/telegram/telegram.module';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TelegramModule,
    LogActivityModule,
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
