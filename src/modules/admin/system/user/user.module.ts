import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TelegramModule } from '@modules/admin/system/telegram/telegram.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TelegramModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
