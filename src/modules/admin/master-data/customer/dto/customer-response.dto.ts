import { Attachment } from '@libs/common/dtos/attachment';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerGender } from '../entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  nameEn: string;

  @ApiProperty()
  nameKh: string;

  @ApiProperty({ enum: CustomerGender })
  gender: CustomerGender;

  @ApiProperty({ required: false, nullable: true })
  dob: string | null;

  @ApiProperty({ required: false, nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ required: false, nullable: true })
  address: string | null;

  @ApiProperty({ required: false, nullable: true })
  note: string | null;

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
