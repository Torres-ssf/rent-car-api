import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnExpectedEndDateAtRentals1618074279858
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'rental',
      'expected_end_date',
      'expected_return_date',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn(
      'rental',
      'expected_return_date',
      'expected_end_date',
    );
  }
}
