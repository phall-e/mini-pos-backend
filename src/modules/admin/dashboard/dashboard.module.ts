import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../master-data/category/entities/category.entity';
import { CustomerEntity } from '../master-data/customer/entities/customer.entity';
import { ProductEntity } from '../master-data/product/entities/product.entity';
import { PurchaseOrderEntity } from '../purchasing/purchase-order/entities/purchase-order.entity';
import { VendorEntity } from '../master-data/vendor/entities/vendor.entity';
import { SaleEntity } from '../saling/sale/entities/sale.entity';
import { StockEntity } from '../stocking/stock/entities/stock.entity';
import { UserEntity } from '../system/user/entities/user.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VendorEntity,
      CustomerEntity,
      CategoryEntity,
      ProductEntity,
      PurchaseOrderEntity,
      SaleEntity,
      StockEntity,
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
