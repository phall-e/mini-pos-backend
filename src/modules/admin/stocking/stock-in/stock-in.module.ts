import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEntity } from '../stock/entities/stock.entity';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';
import { StockInItemEntity } from './entities/stock-in-item.entity';
import { StockInEntity } from './entities/stock-in.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockInEntity, StockInItemEntity, StockEntity]),
    LogActivityModule,
  ],
  controllers: [StockInController],
  providers: [StockInService],
})
export class StockInModule {}
