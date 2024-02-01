import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostCommentReaction1706442745023
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(
      queryRunner,
      'notice_post_comment',
      '공지게시글 댓글',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_comment_history');
  }
}
