import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

type PostgresSslConfig = boolean | { rejectUnauthorized: boolean };

const getSslConfig = (configService: ConfigService): PostgresSslConfig => {
  const ssl = configService.get<string>('TYPEORM_SSL');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  if (ssl === 'false') {
    return false;
  }

  if (ssl === 'true' || isProduction) {
    return {
      rejectUnauthorized:
        configService.get<string>('TYPEORM_SSL_REJECT_UNAUTHORIZED') === 'true',
    };
  }

  return false;
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: Number(configService.get<number>('TYPEORM_PORT')),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
        ssl: getSslConfig(configService),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
