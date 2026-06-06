import { ApiProperty } from '@nestjs/swagger';

export class PurchaseOrderCodeResponseDto {
  @ApiProperty({ example: 'PO2600000001' })
  code: string;
}
