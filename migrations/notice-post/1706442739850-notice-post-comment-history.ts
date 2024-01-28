import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostCommentHistory1706442739850
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'notice_post_comment');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_comment_history');
  }
}
