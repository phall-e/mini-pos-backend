import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LogActivityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  userId: number | null;

  @ApiProperty({ required: false, nullable: true, type: () => UserResponseDto })
  user: UserResponseDto | null;

  @ApiProperty({ required: false, nullable: true })
  module: string | null;

  @ApiProperty({ required: false, nullable: true })
  action: string | null;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ required: false, nullable: true })
  userAgent: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
