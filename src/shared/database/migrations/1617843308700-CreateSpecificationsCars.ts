import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSpecificationsCars1617843308700
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'specification_car',
        columns: [
          {
            name: 'car_id',
            type: 'uuid',
          },
          {
            name: 'specification_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'specification_car',
      new TableForeignKey({
        name: 'FKCarSpecification',
        referencedTableName: 'car',
        referencedColumnNames: ['id'],
        columnNames: ['car_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'specification_car',
      new TableForeignKey({
        name: 'FKSpecificationCar',
        referencedTableName: 'specification',
        referencedColumnNames: ['id'],
        columnNames: ['specification_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('specification_car', 'FKSpecificationCar');

    await queryRunner.dropForeignKey('specification_car', 'FKCarSpecification');

    await queryRunner.dropTable('specification_car');
  }
}
