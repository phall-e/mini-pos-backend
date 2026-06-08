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

  @ApiProperty({
    required: false,
    nullable: true,
    example: '001234567890',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bankAccount?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Mini POS Store',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  merchantName?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Phnom Penh',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  merchantCity?: string | null;

  @ApiProperty({ required: false, nullable: true, example: 10.5 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount?: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    enum: PaymentSettingCurrency,
    example: PaymentSettingCurrency.KHR,
  })
  @IsOptional()
  @IsEnum(PaymentSettingCurrency)
  currency?: PaymentSettingCurrency | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Mini POS',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  storeLabel?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '+85512345678',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'INV-000001',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  billNumber?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'POS-01',
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  terminalLabel?: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: '5999',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  merchantCategoryCode?: string | null;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsOptional()
  @IsBoolean()
  isCashed?: boolean;

  createdById: number;
}
