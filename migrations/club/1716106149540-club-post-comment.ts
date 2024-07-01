import { createCommentTable } from 'migrations/__utils/util';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ClubPostComment1716106149540 implements MigrationInterface {
  parentIdColumn = new TableColumn({
    name: 'parent_id',
    type: 'bigint',
    unsigned: true,
    isNullable: true,
    comment: '부모 댓글 고유 ID',
  });
  parentIdForeignKey = new TableForeignKey({
    name: 'FK_club_post_nested_comment_child_id',
    columnNames: ['parent_id'],
    referencedTableName: 'club_post_comment',
    referencedColumnNames: ['id'],
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
  depthColumn = new TableColumn({
    name: 'depth',
    type: 'tinyint',
    unsigned: true,
    isNullable: false,
    default: 0,
    comment: '댓글 깊이 (0부터 시작)',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await createCommentTable(queryRunner, {
      name: 'club_post',
      description: '동아리 게시글',
    });

    await queryRunner.addColumns('club_post_comment', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
    await queryRunner.createForeignKey(
      'club_post_comment',
      this.parentIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_comment');
  }
}
