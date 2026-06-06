import { Attachment } from '@libs/common/dtos/attachment';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiProperty({ required: false })
  phoneNumber: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false, nullable: true, type: () => Attachment })
  profile: Attachment | null;

  @ApiProperty({ required: false, nullable: true, type: () => [Attachment] })
  attachments: Attachment[] | null;

  @ApiProperty()
  createdById: number;

  @ApiProperty()
  createdBy: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
