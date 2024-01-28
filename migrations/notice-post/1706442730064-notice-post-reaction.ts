import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoticePostReaction1706442730064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(queryRunner, 'notice_post', '공지 게시글');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notice_post_reaction');
  }
}
