import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from './entities/telegram.entity';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TelegramEntity,
    ]),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
