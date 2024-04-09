import { createHistoryTable } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ClubApplicationsFormHistory1711791453308
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await createHistoryTable(queryRunner, 'club_applications_form', {
      dropColumns: ['updated_at'],
    });

    queryRunner.addColumn(
      'club_applications_form_history',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        unsigned: true,
        isNullable: true,
        comment: '동아리 지원서 폼 수정 유저',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_applications_form_history');
  }
}
