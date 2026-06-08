import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { PaymentSettingCurrency } from '../entities/payment-setting.entity';

export class PaymentSettingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true, type: () => Attachment })
  logo: Attachment | null;

  @ApiProperty({ required: false, nullable: true })
  bankAccount: string | null;

  @ApiProperty({ required: false, nullable: true })
  merchantName: string | null;

  @ApiProperty({ required: false, nullable: true })
  merchantCity: string | null;

  @ApiProperty({ required: false, nullable: true })
  amount: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    enum: PaymentSettingCurrency,
  })
  currency: PaymentSettingCurrency | null;

  @ApiProperty({ required: false, nullable: true })
  storeLabel: string | null;

  @ApiProperty({ required: false, nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ required: false, nullable: true })
  billNumber: string | null;

  @ApiProperty({ required: false, nullable: true })
  terminalLabel: string | null;

  @ApiProperty({ required: false, nullable: true })
  merchantCategoryCode: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isCashed: boolean;

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
