import { Attachment } from '@libs/common/dtos/attachment';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateVendorRequestDto {
  @ApiProperty({ example: 'VND-001', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'ABC Supplier', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameEn: string;

  @ApiProperty({ example: 'ABC Supplier KH', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nameKh: string;

  @ApiProperty({ required: false, example: '+85512345678', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @ApiProperty({ required: false, example: 'supplier@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

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
