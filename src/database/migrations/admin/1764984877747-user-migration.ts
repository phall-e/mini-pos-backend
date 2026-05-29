import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { commonFields } from "../common.fields";

const tableName = 'admin.users';

export class UserMigration1764984877747 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        isNullable: false,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '150',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        length: '260',
                        isNullable: false,
                    },
                    {
                        name: 'otp_code',
                        type: 'varchar',
                        length: '6',
                        isNullable: true,
                        default: true,
                    },
                    {
                        name: 'is_admin',
                        type: 'boolean',
                        default: null,
                        isNullable: true,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                        isNullable: true,
                    },
                    ...commonFields,
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName);
    }

}
