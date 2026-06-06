import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';
import { StockInItemEntity } from './entities/stock-in-item.entity';
import { StockInEntity } from './entities/stock-in.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockInEntity, StockInItemEntity, StockEntity]),
  ],
  controllers: [StockInController],
  providers: [StockInService],
})
export class StockInModule {}
