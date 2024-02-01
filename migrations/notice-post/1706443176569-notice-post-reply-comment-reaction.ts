import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostReplyCommentReaction1706443176569
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(
      queryRunner,
      'notice_post_reply_comment',
      '공지게시글 대댓글',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_reply_comment_reaction');
  }
}
