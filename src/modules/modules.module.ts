import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AdminModule, 
  ]
})
export class ModulesModule {}
