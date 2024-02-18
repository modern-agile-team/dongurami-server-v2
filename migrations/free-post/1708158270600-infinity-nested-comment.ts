import {
  createHistoryTable,
  createReactionTable,
  createReplyCommentTable,
} from 'migrations/__utils/util';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class InfinityNestedComment1708158270600 implements MigrationInterface {
  parentIdColumn = new TableColumn({
    name: 'parent_id',
    type: 'int',
    unsigned: true,
    isNullable: true,
    comment: '부모 댓글 고유 ID',
  });
  parentIdForeignKey = new TableForeignKey({
    name: 'FK_free_post_nested_comment_child_id',
    columnNames: ['parent_id'],
    referencedTableName: 'free_post_comment',
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
    await Promise.all([
      queryRunner.dropTable('free_post_reply_comment'),
      queryRunner.dropTable('free_post_reply_comment_history'),
      queryRunner.dropTable('free_post_reply_comment_reaction'),
    ]);

    await queryRunner.addColumns('free_post_comment', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
    await queryRunner.createForeignKey(
      'free_post_comment',
      this.parentIdForeignKey,
    );

    await queryRunner.addColumns('free_post_comment_history', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      createReplyCommentTable(queryRunner, {
        name: 'free_post',
        description: '자유 게시글',
      }),
      createReactionTable(
        queryRunner,
        'free_post_reply_comment',
        '자유게시글 대댓글',
      ),
      createHistoryTable(queryRunner, 'free_post_reply_comment'),
    ]);

    await queryRunner.dropForeignKey(
      'free_post_comment',
      this.parentIdForeignKey,
    );

    await queryRunner.dropColumns('free_post_comment', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
    await queryRunner.dropColumns('free_post_comment_history', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
  }
}
