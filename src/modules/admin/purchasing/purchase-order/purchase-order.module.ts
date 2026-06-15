import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderEntity } from './entities/purchase-order.entity';
import { PurchaseOrderItemEntity } from './entities/purchase-order-item.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseOrderEntity, PurchaseOrderItemEntity]),
    LogActivityModule,
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
