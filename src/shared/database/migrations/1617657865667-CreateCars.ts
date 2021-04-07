import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCars1617657865667 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'car',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'brand',
            type: 'varchar',
          },
          {
            name: 'max_speed',
            type: 'numeric',
          },
          {
            name: 'horse_power',
            type: 'integer',
          },
          {
            name: 'zero_to_one_hundred',
            type: 'numeric',
          },
          {
            name: 'license_plate',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'daily_value',
            type: 'numeric',
          },
          {
            name: 'fine_amount',
            type: 'numeric',
          },
          {
            name: 'available',
            type: 'boolean',
            default: true,
          },
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKCategoryCar',
            referencedTableName: 'category',
            referencedColumnNames: ['id'],
            columnNames: ['category_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('car', 'FKCategoryCar');

    await queryRunner.dropTable('car');
  }
}
