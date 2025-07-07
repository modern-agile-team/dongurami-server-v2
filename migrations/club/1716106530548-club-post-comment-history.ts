import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubPostCommentHistory1716106530548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'club_post_comment');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_comment_history');
  }
}
