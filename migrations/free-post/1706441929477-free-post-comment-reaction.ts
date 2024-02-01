import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostCommentReaction1706441929477
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(
      queryRunner,
      'free_post_comment',
      '자유게시글 댓글',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_comment_history');
  }
}
