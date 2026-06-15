import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), LogActivityModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
