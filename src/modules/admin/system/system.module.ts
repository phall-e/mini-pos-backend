import { Module } from '@nestjs/common';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { PaymentSettingModule } from './payment-setting/payment-setting.module';

@Module({
  imports: [PermissionModule, RoleModule, UserModule, PaymentSettingModule],
})
export class SystemModule {}
