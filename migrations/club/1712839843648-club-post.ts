import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ClubPost1712839843648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_post',
        columns: [
          generatePrimaryColumn('동아리 게시글 고유 ID'),
          new TableColumn({
            name: 'club_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          }),
          new TableColumn({
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 게시글 생성 유저 고유 ID',
          }),
          new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: false,
            comment: '동아리 게시글 본문',
          }),
          new TableColumn({
            name: 'tags',
            type: 'json',
            isNullable: false,
            comment: '동아리 게시글 해시태그',
          }),
          new TableColumn({
            name: 'status',
            type: 'enum',
            enum: ['posting', 'remove'],
            isNullable: false,
            default: `"posting"`,
            comment: '동아리 게시글 상태',
          }),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            columnNames: ['club_id'],
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query('ALTER TABLE club_post COMMENT="동아리 게시판"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post');
  }
}
