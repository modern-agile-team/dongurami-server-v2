import { createCommentTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostComment1706442736320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createCommentTable(queryRunner, {
      name: 'notice_post',
      description: '공지 게시글',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_comment');
  }
}
