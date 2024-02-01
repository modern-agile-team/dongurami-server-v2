import { createReplyCommentTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostReplyComment1706442010302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReplyCommentTable(queryRunner, {
      name: 'free_post',
      description: '자유 게시글',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_reply_comment');
  }
}
