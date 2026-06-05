import { Module } from '@nestjs/common';
import { UomModule } from './uom/uom.module';

@Module({
  imports: [UomModule]
})
export class MasterDataModule {}
