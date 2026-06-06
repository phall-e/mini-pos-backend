import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';
import { StockAdjustmentModule } from './stock-adjustment/stock-adjustment.module';
import { StockInModule } from './stock-in/stock-in.module';

@Module({
  imports: [StockModule, StockAdjustmentModule, StockInModule],
})
export class StockingModule {}
