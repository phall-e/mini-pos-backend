import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSettingEntity } from './entities/payment-setting.entity';
import { PaymentSettingService } from './payment-setting.service';
import { PaymentSettingController } from './payment-setting.controller';
import { TelegramModule } from '@telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentSettingEntity,
    ]),
    TelegramModule,
  ],
  controllers: [PaymentSettingController],
  providers: [PaymentSettingService],
})
export class PaymentSettingModule {}
