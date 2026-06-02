import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ModulesModule } from './modules/modules.module';
import { TelegramModule } from './telegram/telegram.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    CloudinaryModule,
    ModulesModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
