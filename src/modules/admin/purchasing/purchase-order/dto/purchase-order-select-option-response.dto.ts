import { VendorResponseDto } from '@modules/admin/master-data/vendor/dto/vendor-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';

export class PurchaseOrderSelectOptionResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  orderDate: string;

  @ApiProperty()
  vendorId: number;

  @ApiProperty()
  vendor: VendorResponseDto;

  @ApiProperty({ enum: PurchaseOrderStatus })
  status: PurchaseOrderStatus;
}
