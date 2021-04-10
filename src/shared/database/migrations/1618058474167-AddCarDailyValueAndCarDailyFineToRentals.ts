import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCarDailyValueAndCarDailyFineToRentals1618058474167
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('rental', [
      new TableColumn({
        name: 'car_daily_value',
        type: 'numeric',
      }),
      new TableColumn({
        name: 'car_daily_fine',
        type: 'numeric',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('rental', 'car_daily_fine');

    await queryRunner.dropColumn('rental', 'car_daily_value');
  }
}
