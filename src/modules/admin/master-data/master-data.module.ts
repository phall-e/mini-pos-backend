import { Module } from '@nestjs/common';
import { UomModule } from './uom/uom.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [UomModule, CategoryModule, ProductModule, VendorModule],
})
export class MasterDataModule {}
