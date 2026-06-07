import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const saleTableName = 'admin.sales';
const saleItemTableName = 'admin.sale_items';

export class SaleMigration1764990000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: saleTableName,
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
            length: '150',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'sale_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'customer_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pending', 'Cancelled', 'Completed'],
            default: "'Pending'",
            isNullable: false,
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.customers',
            onUpdate: 'CASCADE',
          },
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

    await queryRunner.createTable(
      new Table({
        name: saleItemTableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'sale_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['sale_id'],
            referencedColumnNames: ['id'],
            referencedTableName: saleTableName,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.products',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(saleItemTableName, true, true);
    await queryRunner.dropTable(saleTableName, true, true);
  }
}
