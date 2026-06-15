import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { LogActivityModule } from '@modules/admin/system/log-activity/log-activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), LogActivityModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
