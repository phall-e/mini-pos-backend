import { ApiProperty } from '@nestjs/swagger';

export class GenerateQrCodeStatusResponseDto {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty({ required: false, nullable: true, example: null })
  errorCode: string | null;

  @ApiProperty({ required: false, nullable: true, example: null })
  message: string | null;
}

export class GenerateQrCodeDataResponseDto {
  @ApiProperty({ example: 'szzfsgasdwatwqerewafeafe' })
  qr: string;

  @ApiProperty({ example: 'sasdajiefklsfjdk' })
  md5: string;
}

export class GenerateQrCodeResponseDto {
  @ApiProperty({ type: () => GenerateQrCodeStatusResponseDto })
  status: GenerateQrCodeStatusResponseDto;

  @ApiProperty({ type: () => GenerateQrCodeDataResponseDto })
  data: GenerateQrCodeDataResponseDto;
}
