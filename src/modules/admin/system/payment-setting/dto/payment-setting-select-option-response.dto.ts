import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentSettingSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true, type: () => Attachment })
  logo: Attachment | null;

  @ApiProperty()
  isCashed: boolean;
}
