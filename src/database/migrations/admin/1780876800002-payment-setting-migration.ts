import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.payment_settings';

export class PaymentSettingMigration1780876800002 implements MigrationInterface {
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
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'logo',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'bank_account',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'merchant_name',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'merchant_city',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'currency',
            type: 'enum',
            enum: ['usd', 'khr'],
            isNullable: true,
          },
          {
            name: 'store_label',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'bill_number',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'terminal_label',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          {
            name: 'merchant_category_code',
            type: 'varchar',
            length: '50',
            default: "'5999'",
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'is_cashed',
            type: 'boolean',
            default: false,
            isNullable: false,
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
