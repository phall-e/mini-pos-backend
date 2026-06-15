import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '@modules/admin/stocking/stock/entities/stock.entity';
import { SaleItemEntity } from './entities/sale-item.entity';
import { SaleEntity } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TelegramModule } from '@modules/admin/system/telegram/telegram.module';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleEntity, SaleItemEntity, StockEntity]),
    TelegramModule,
    LogActivityModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
