import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogActivityEntity } from './entities/log-activity.entity';
import { LogActivityController } from './log-activity.controller';
import { LogActivityService } from './log-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogActivityEntity])],
  providers: [LogActivityService],
  exports: [LogActivityService],
  controllers: [LogActivityController],
})
export class LogActivityModule {}
