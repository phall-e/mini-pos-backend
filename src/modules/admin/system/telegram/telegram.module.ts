import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/telegram.entity';
import { TelegramController } from './telegram.controller';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([TelegramEntity]), LogActivityModule],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
