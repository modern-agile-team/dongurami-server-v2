import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyAttachmentPathLength1713955105509
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE attachment MODIFY path varchar(19)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE attachment MODIFY path varchar(18)');
  }
}
