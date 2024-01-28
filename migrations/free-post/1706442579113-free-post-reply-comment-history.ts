import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostReplyCommentHistory1706442579113
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'free_post_reply_comment');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_reply_comment_history');
  }
}
