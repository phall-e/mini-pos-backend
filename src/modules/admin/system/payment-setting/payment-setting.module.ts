import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentSettingEntity } from './entities/payment-setting.entity';
import { PaymentSettingService } from './payment-setting.service';
import { PaymentSettingController } from './payment-setting.controller';
import { TelegramModule } from '@modules/admin/system/telegram/telegram.module';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentSettingEntity]),
    TelegramModule,
    LogActivityModule,
  ],
  controllers: [PaymentSettingController],
  providers: [PaymentSettingService],
})
export class PaymentSettingModule {}
