import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClubHistory1708776176949 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'club');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_history');
  }
}
