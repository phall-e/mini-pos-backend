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

  @ApiProperty()
  bankAccount: string;

  @ApiProperty()
  merchantName: string;

  @ApiProperty()
  merchantCity: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentSettingCurrency })
  currency: PaymentSettingCurrency;

  @ApiProperty()
  storeLabel: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  billNumber: string;

  @ApiProperty()
  terminalLabel: string;

  @ApiProperty()
  merchantCategoryCode: string;

  @ApiProperty()
  isActive: boolean;

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
