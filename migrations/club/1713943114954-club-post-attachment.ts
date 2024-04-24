import {
  generateCreatedAtColumn,
  generateFkColumn,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ClubPostAttachment1713943114954 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [clubPostColumn, clubPostFk] = generateFkColumn(
      'club_post',
      '동아리 게시글 고유 ID',
    );

    await queryRunner.createTable(
      new Table({
        name: 'club_post_attachment',
        columns: [
          new TableColumn({
            name: 'attachment_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '첨부 파일 고유 ID',
          }),
          clubPostColumn,
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            columnNames: ['attachment_id'],
            referencedTableName: 'attachment',
            referencedColumnNames: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          clubPostFk,
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE club_post_attachment COMMENT = "동아리 게시글 첨부 파일"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_attachment');
  }
}
