import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const saleTableName = 'admin.sales';
const saleItemTableName = 'admin.sale_items';

export class MoveDiscountToSaleItem1780876800006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      saleItemTableName,
      new TableColumn({
        name: 'discount',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.query(`
      UPDATE ${saleItemTableName} item
      SET discount = sale.discount
      FROM ${saleTableName} sale
      WHERE item.sale_id = sale.id
        AND item.id = (
          SELECT first_item.id
          FROM ${saleItemTableName} first_item
          WHERE first_item.sale_id = sale.id
            AND first_item.deleted_at IS NULL
          ORDER BY first_item.id ASC
          LIMIT 1
        )
    `);

    await queryRunner.dropColumn(saleTableName, 'discount');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      saleTableName,
      new TableColumn({
        name: 'discount',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    await queryRunner.query(`
      UPDATE ${saleTableName} sale
      SET discount = COALESCE(item_summary.discount, 0)
      FROM (
        SELECT sale_id, SUM(discount) AS discount
        FROM ${saleItemTableName}
        WHERE deleted_at IS NULL
        GROUP BY sale_id
      ) item_summary
      WHERE item_summary.sale_id = sale.id
    `);

    await queryRunner.dropColumn(saleItemTableName, 'discount');
  }
}
