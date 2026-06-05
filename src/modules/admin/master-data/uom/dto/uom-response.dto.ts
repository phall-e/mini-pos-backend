import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UomResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
