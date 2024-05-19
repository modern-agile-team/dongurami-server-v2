import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubPostReaction1716101991787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(queryRunner, 'club_post', '동아리 게시글');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_reaction');
  }
}
