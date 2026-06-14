import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const productTableName = 'admin.products';

export class AddDiscountToProduct1780876800005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      productTableName,
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
    await queryRunner.dropColumn(productTableName, 'discount');
  }
}
