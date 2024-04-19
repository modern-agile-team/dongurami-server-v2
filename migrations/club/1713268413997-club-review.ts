import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generateFkColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ClubReview1713268413997 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [userColumn, userFk] = generateFkColumn(
      'user',
      '동아리 후기 생성 유저 고유 ID',
    );
    const [clubColumn, clubFk] = generateFkColumn('club', '동아리 고유 ID');

    await queryRunner.createTable(
      new Table({
        name: 'club_review',
        columns: [
          generatePrimaryColumn('동아리 후기 고유 ID'),
          userColumn,
          clubColumn,
          new TableColumn({
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '동아리 후기 본문',
          }),
          new TableColumn({
            name: 'star_rate',
            type: 'tinyint',
            unsigned: true,
            isNullable: false,
            comment: '동아리 후기 별점(1 ~ 5점)',
          }),
          new TableColumn({
            name: 'is_anonymous',
            type: 'tinyint',
            length: '1',
            unsigned: true,
            default: 1,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          }),
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['posting', 'remove'],
            isNullable: false,
            default: `"posting"`,
            comment: '동아리 후기 상태',
          }),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [userFk, clubFk],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_review');
  }
}
