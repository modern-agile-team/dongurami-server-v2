import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FreePostTagLink1710580167472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'free_post_tag_link',
        columns: [
          generatePrimaryColumn('자유게시글 태그 링크 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유게시글 태그 링크 생성 유저 고유 ID',
          },
          {
            name: 'free_post_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유게시글 고유 ID',
          },
          {
            name: 'post_tag_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 태그 고유 ID',
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
            referencedTableName: 'free_post',
            referencedColumnNames: ['id'],
            columnNames: ['free_post_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'post_tag',
            referencedColumnNames: ['id'],
            columnNames: ['post_tag_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_post_tag_link COMMENT = "자유게시글 태그 링크"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('free_post_tag_link');
  }
}