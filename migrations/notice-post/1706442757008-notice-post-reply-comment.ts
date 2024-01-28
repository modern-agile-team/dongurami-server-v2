import { createReplyCommentTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostReplyComment1706442757008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReplyCommentTable(queryRunner, {
      name: 'notice_post',
      description: '공지 게시글',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_reply_comment');
  }
}
