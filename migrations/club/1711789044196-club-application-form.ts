import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubApplicationsForm1711789044196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_application_form',
        columns: [
          generatePrimaryColumn('동아리 지원서 폼'),
          {
            name: 'club_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'common_question',
            type: 'json',
            isNullable: false,
            comment: '공통 질문',
          },
          {
            name: 'custom_question',
            type: 'json',
            isNullable: false,
            comment: '동아리 커스텀 질문',
          },
          {
            name: 'starts_at',
            type: 'timestamp',
            isNullable: true,
            comment: '모집 시작일자',
          },
          {
            name: 'ends_at',
            type: 'timestamp',
            isNullable: true,
            comment: '모집 시작종료일자',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            columnNames: ['club_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE club_application_form COMMENT = "동아리 지원서 폼"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_application_form');
  }
}
