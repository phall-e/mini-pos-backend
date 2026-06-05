import { ApiProperty } from '@nestjs/swagger';

export class UserActionResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;
}
