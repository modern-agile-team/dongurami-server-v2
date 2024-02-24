import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubTagLink1708777940870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_tag_link',
        columns: [
          generatePrimaryColumn('동아리 태그 링크 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 태그 링크 생성 유저 고유 ID',
          },
          {
            name: 'club_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'club_tag_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 태그 고유 ID',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            columnNames: ['club_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'club_tag',
            referencedColumnNames: ['id'],
            columnNames: ['club_tag_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE club_tag_link COMMENT = "동아리 태그 링크"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_tag_link');
  }
}
