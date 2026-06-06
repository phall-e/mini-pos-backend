import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CustomerGender } from '../entities/customer.entity';

export class CreateCustomerRequestDto {
  @ApiProperty({ example: 'CUS-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'John Doe', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameEn: string;

  @ApiProperty({ example: 'John Doe KH', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameKh: string;

  @ApiProperty({ enum: CustomerGender, example: CustomerGender.MALE })
  @IsNotEmpty()
  @IsEnum(CustomerGender)
  gender: CustomerGender;

  @ApiProperty({ required: false, nullable: true, example: '1995-01-15' })
  @IsOptional()
  @IsDateString()
  dob?: string | null;

  @ApiProperty({ required: false, nullable: true, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  phoneNumber?: string | null;

  @ApiProperty({ required: false, nullable: true, maxLength: 250 })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  address?: string | null;

  @ApiProperty({ required: false, nullable: true, maxLength: 250 })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  note?: string | null;

  @ApiProperty({ required: false, nullable: true, type: () => Attachment })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Attachment)
  profile?: Attachment | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: () => [Attachment],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments?: Attachment[] | null;

  createdById: number;
}
