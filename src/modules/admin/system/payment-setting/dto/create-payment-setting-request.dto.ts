import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentSettingCurrency } from '../entities/payment-setting.entity';

export class CreatePaymentSettingRequestDto {
  @ApiProperty({ example: 'Main KHQR', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ required: false, nullable: true, type: () => Attachment })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Attachment)
  logo?: Attachment | null;

  @ApiProperty({ example: '001234567890', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  bankAccount: string;

  @ApiProperty({ example: 'Mini POS Store', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  merchantName: string;

  @ApiProperty({ example: 'Phnom Penh', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  merchantCity: string;

  @ApiProperty({ example: 10.5 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    enum: PaymentSettingCurrency,
    example: PaymentSettingCurrency.KHR,
  })
  @IsNotEmpty()
  @IsEnum(PaymentSettingCurrency)
  currency: PaymentSettingCurrency;

  @ApiProperty({ example: 'Mini POS', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  storeLabel: string;

  @ApiProperty({ example: '+85512345678', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phoneNumber: string;

  @ApiProperty({ example: 'INV-000001', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  billNumber: string;

  @ApiProperty({ example: 'POS-01', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  terminalLabel: string;

  @ApiProperty({ required: false, example: '5999', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  merchantCategoryCode?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  createdById: number;
}
