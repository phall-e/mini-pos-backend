import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity]), LogActivityModule],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
