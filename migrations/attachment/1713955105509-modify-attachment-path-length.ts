import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyAttachmentPathLength1713955105509
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE attachment MODIFY path VARCHAR(255) NOT NULL COMMENT "domain을 제외한 path"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE attachment MODIFY path VARCHAR(18) NOT NULL COMMENT "domain을 제외한 path"',
    );
  }
}
