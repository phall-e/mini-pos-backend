import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockAdjustmentModule } from './stock-adjustment/stock-adjustment.module';

@Module({
  imports: [StockModule, StockAdjustmentModule],
})
export class StockingModule {}
