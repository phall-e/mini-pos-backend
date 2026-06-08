import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const saleTableName = 'admin.sales';

export class AddPaymentTypeToSale1780876800003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      saleTableName,
      new TableColumn({
        name: 'payment_type_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      saleTableName,
      new TableForeignKey({
        columnNames: ['payment_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admin.payment_settings',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(saleTableName);
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('payment_type_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey(saleTableName, foreignKey);
    }

    await queryRunner.dropColumn(saleTableName, 'payment_type_id');
  }
}
