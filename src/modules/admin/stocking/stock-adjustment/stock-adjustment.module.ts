import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { StockAdjustmentService } from './stock-adjustment.service';
import { StockAdjustmentController } from './stock-adjustment.controller';
import { StockAdjustmentEntity } from './entities/stock-adjustment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockAdjustmentEntity, StockEntity])],
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService],
})
export class StockAdjustmentModule {}
