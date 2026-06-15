import { Module } from '@nestjs/common';
import { UomService } from './uom.service';
import { UomController } from './uom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UomEntity } from './entities/uom.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([UomEntity]), LogActivityModule],
  controllers: [UomController],
  providers: [UomService],
})
export class UomModule {}
