import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.products';

export class ProductMigration1764984877751 implements MigrationInterface {
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
            name: 'category_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'uom_id',
            type: 'integer',
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
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'thumbnail',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 14,
            scale: 2,
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
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.categories',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['uom_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.uom',
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
