import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetUserPasswordRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
