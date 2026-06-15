import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}
