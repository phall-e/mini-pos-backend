import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const saleTableName = 'admin.sales';

export class AddDiscountToSale1780876800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(saleTableName, 'discount');
  }
}
