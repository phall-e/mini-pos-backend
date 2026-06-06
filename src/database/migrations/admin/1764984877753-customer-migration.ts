import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.customers';

export class CustomerMigration1764984877753 implements MigrationInterface {
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
            name: 'code',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name_en',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'name_kh',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'enum',
            enum: ['male', 'female'],
            isNullable: false,
          },
          {
            name: 'dob',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'note',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'profile',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_by_id',
            type: 'integer',
            isNullable: false,
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['created_by_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.users',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true, true);
  }
}
