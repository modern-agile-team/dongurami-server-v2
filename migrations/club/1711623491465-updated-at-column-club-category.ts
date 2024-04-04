import { generateUpdatedAtColumn } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatedAtColumnClubCategory1711623491465
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'club_category',
      new TableColumn(generateUpdatedAtColumn()),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('club_category', 'updated_at');
  }
}
