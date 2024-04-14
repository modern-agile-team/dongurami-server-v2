import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ClubAddTags1712996267068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'club',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '동아리 태그',
      }),
    );
    await queryRunner.addColumn(
      'club_history',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '동아리 태그',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('club', 'tags');
    await queryRunner.dropColumn('club_history', 'tags');
  }
}
