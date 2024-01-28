import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostReplyCommentReaction1706442523748
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(
      queryRunner,
      'free_post_reply_comment',
      '자유게시글 대댓글',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_reply_comment_reaction');
  }
}
