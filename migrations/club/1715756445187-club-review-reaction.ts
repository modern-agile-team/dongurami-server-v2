import { createReactionTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubReviewReaction1715756445187 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createReactionTable(queryRunner, 'club_review', '동아리 후기');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_review_reaction');
  }
}
