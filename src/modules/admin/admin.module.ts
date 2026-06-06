import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { MasterDataModule } from './master-data/master-data.module';
import { PurchasingModule } from './purchasing/purchasing.module';
import { StockingModule } from './stocking/stocking.module';

@Module({
  imports: [SystemModule, MasterDataModule, PurchasingModule, StockingModule],
})
export class AdminModule {}
