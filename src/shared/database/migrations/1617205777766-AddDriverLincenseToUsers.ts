import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDriverLincenseToUsers1617205777766
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'driver_license',
        type: 'varchar',
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'driver_license');
  }
}
