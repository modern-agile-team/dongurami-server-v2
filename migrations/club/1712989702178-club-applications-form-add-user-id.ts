import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ClubApplicationsFormAddUserId1712989702178
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'club_application_form',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        unsigned: true,
        isNullable: false,
        comment: '동아리 지원서 포맷 작성자 고유 ID',
      }),
    );

    await queryRunner.createForeignKey(
      'club_application_form',
      new TableForeignKey({
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userIdIndexes = await queryRunner.query(
      "SHOW INDEX FROM club_application_form WHERE Column_name = 'user_id';",
    );
    await queryRunner.dropForeignKey(
      'club_application_form',
      userIdIndexes[0].Key_name,
    );

    await queryRunner.dropColumn('club_application_form', 'user_id');
  }
}
