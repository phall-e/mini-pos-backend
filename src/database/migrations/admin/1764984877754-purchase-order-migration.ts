import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const purchaseOrderTableName = 'admin.purchase_orders';
const purchaseOrderItemTableName = 'admin.purchase_order_items';

export class PurchaseOrderMigration1764984877754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: purchaseOrderTableName,
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
            name: 'order_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'vendor_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_by_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Pending', 'Cancelled', 'Completed'],
            default: "'Pending'",
            isNullable: false,
          },
          {
            name: 'attachments',
            type: 'jsonb',
            isNullable: true,
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['vendor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'admin.vendors',
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
        name: purchaseOrderItemTableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'purchase_order_id',
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
            type: 'varchar',
            length: '250',
            isNullable: true,
          },
          ...commonFields,
        ],
        foreignKeys: [
          {
            columnNames: ['purchase_order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: purchaseOrderTableName,
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
    await queryRunner.dropTable(purchaseOrderItemTableName, true, true);
    await queryRunner.dropTable(purchaseOrderTableName, true, true);
  }
}
