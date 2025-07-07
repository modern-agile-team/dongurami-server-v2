import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubReviewHistory1713332089454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'club_review');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_review_history');
  }
}
