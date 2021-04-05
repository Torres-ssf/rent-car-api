import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnImageToAvatarOnUsers1617458417899
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('user', 'image', 'avatar');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('user', 'avatar', 'image');
  }
}
