import { Module } from '@nestjs/common';
import { SaleModule } from './sale/sale.module';

@Module({
  imports: [SaleModule],
})
export class SalingModule {}
