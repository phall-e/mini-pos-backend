import "tsconfig-paths/register";
import dotenv from "dotenv";
import { DataSource, type DataSourceOptions } from "typeorm";
import { type SeederOptions } from "typeorm-extension";

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    // extra: {
    //     options: '-c timezone=Asia/Phnom_Penh',
    // },
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: ['src/modules/**/*/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/admin/*{.ts,.js}'],
    seeds: ['src/database/seeds/main.seed.ts'],
    logging: true,
    synchronize: false,
    ssl: true,
};

export const AppDataSource = new DataSource(options);