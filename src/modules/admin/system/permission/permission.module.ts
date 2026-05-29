import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroupEntity } from './entities/permission-group.entity';
import { PermissionEntity } from './entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionGroupEntity,
      PermissionEntity,
    ]),
  ],
  providers: [PermissionService],
  controllers: [PermissionController]
})
export class PermissionModule {}
