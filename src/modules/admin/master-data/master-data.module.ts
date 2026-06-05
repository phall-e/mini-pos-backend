import { Module } from '@nestjs/common';
import { UomModule } from './uom/uom.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UomModule, CategoryModule]
})
export class MasterDataModule {}
