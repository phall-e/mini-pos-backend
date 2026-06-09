import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '@modules/admin/stocking/stock/entities/stock.entity';
import { SaleItemEntity } from './entities/sale-item.entity';
import { SaleEntity } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TelegramModule } from '@modules/admin/system/telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaleEntity, 
      SaleItemEntity, 
      StockEntity,
    ]),
    TelegramModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
