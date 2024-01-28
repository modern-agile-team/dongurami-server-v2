import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostHistory1706442725957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'notice_post');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_history');
  }
}
