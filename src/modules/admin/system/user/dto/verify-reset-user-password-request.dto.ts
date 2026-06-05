import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResetUserPasswordRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
