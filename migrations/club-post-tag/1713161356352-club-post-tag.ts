import {
  generateCreatedAtColumn,
  generateFkColumn,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ClubPostTag1713161356352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [userColumn, userFk] = generateFkColumn(
      'user',
      '동아리 게시글 태그 생성 유저 고유 ID',
    );

    await queryRunner.createTable(
      new Table({
        name: 'club_post_tag',
        columns: [
          generatePrimaryColumn('동아리 게시글 태그'),
          userColumn,
          new TableColumn({
            name: 'name',
            type: 'varchar',
            length: '15',
            isUnique: true,
            isNullable: false,
            comment: '동아리 게시글 태그 명',
          }),
          generateCreatedAtColumn(),
        ],
        foreignKeys: [userFk],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_tag');
  }
}
