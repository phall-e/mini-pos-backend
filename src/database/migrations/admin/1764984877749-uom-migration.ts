import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.uom';

export class UomMigration1764984877749 implements MigrationInterface {
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
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_by_id',
            type: 'integer',
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
