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

export class InfinityNestedComment1708246489577 implements MigrationInterface {
  parentIdColumn = new TableColumn({
    name: 'parent_id',
    type: 'int',
    unsigned: true,
    isNullable: true,
    comment: '부모 댓글 고유 ID',
  });
  parentIdForeignKey = new TableForeignKey({
    name: 'FK_notice_post_nested_comment_child_id',
    columnNames: ['parent_id'],
    referencedTableName: 'notice_post_comment',
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
      queryRunner.dropTable('notice_post_reply_comment'),
      queryRunner.dropTable('notice_post_reply_comment_history'),
      queryRunner.dropTable('notice_post_reply_comment_reaction'),
    ]);

    await queryRunner.addColumns('notice_post_comment', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
    await queryRunner.createForeignKey(
      'notice_post_comment',
      this.parentIdForeignKey,
    );

    await queryRunner.addColumns('notice_post_comment_history', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all([
      createReplyCommentTable(queryRunner, {
        name: 'notice_post',
        description: '공지 게시글',
      }),
      createReactionTable(
        queryRunner,
        'notice_post_reply_comment',
        '공지게시글 대댓글',
      ),
      createHistoryTable(queryRunner, 'notice_post_reply_comment'),
    ]);

    await queryRunner.dropForeignKey(
      'notice_post_comment',
      this.parentIdForeignKey,
    );

    await queryRunner.dropColumns('notice_post_comment', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
    await queryRunner.dropColumns('notice_post_comment_history', [
      this.parentIdColumn,
      this.depthColumn,
    ]);
  }
}
