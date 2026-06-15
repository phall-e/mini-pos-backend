import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { PaymentSettingModule } from './payment-setting/payment-setting.module';
import { LogActivityModule } from './log-activity/log-activity.module';

@Module({
  imports: [
    PermissionModule,
    RoleModule,
    UserModule,
    PaymentSettingModule,
    LogActivityModule,
  ],
})
export class SystemModule {}
