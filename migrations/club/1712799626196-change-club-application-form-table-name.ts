import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeClubApplicationFormTableName1712799626196
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'club_applications_form',
      'club_application_form',
    );
    await queryRunner.renameTable(
      'club_applications_form_history',
      'club_application_form_history',
    );
    await queryRunner.renameColumn(
      'club_application_form_history',
      'club_applications_form_id',
      'club_application_form_id',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable(
      'club_application_form',
      'club_applications_form',
    );
    await queryRunner.renameTable(
      'club_application_form_history',
      'club_applications_form_history',
    );
  }
}
