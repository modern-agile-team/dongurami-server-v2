import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreePostReaction1706440474169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(queryRunner, 'free_post', '자유 게시글');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_reaction');
  }
}
