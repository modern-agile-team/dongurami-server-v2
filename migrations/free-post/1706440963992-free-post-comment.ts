import { createCommentTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostComment1706440963992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createCommentTable(queryRunner, {
      name: 'free_post',
      description: '자유 게시글',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_comment');
  }
}
