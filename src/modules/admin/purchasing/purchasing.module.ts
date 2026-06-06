import { Module } from '@nestjs/common';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';

@Module({
  imports: [PurchaseOrderModule],
})
export class PurchasingModule {}
