import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.stocks';

export class StockMigration1764984877755 implements MigrationInterface {
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
            name: 'product_id',
            type: 'integer',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'min_stock',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'stock_adjustment',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'stock_in',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'stock_out',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
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
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.products',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true, true);
  }
}
