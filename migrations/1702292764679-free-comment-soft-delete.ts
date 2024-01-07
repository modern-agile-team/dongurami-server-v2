import { CommonPostStatus } from '@src/apis/common-posts/constants/common-posts.enum';
import { HistoryAction } from '@src/constants/enum';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CommentSoftDelete1702282278539 implements MigrationInterface {
  /**
   * typeorm 버그로 raw query 를 이용해 가져옴
   */
  async getForeignKey(
    queryRunner: QueryRunner,
    tableName: string,
    refTableName: string,
  ): Promise<string> {
    const databaseName = await queryRunner.getCurrentDatabase();

    const fKey = await queryRunner.query(`
    SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
	REFERENCED_TABLE_SCHEMA = '${databaseName}'
	AND TABLE_NAME = '${tableName}'
    AND REFERENCED_TABLE_NAME = '${refTableName}';
    `);

    return fKey[0].CONSTRAINT_NAME;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 자유 게시글 댓글
    await queryRunner.addColumns('free_post_comment', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [CommonPostStatus.Posting, CommonPostStatus.Remove],
        isNullable: false,
        default: `"${CommonPostStatus.Posting}"`,
        comment: '자유 게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_post_comment ALTER COLUMN status DROP DEFAULT',
    );
    await queryRunner.addColumns('free_post_comment_history', [
      new TableColumn({
        name: 'action',
        type: 'enum',
        enum: [
          HistoryAction.Insert,
          HistoryAction.Update,
          HistoryAction.Delete,
        ],
        isNullable: false,
        default: `"${HistoryAction.Insert}"`,
        comment: 'history 를 쌓는 action',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [CommonPostStatus.Posting, CommonPostStatus.Remove],
        isNullable: false,
        default: `"${CommonPostStatus.Posting}"`,
        comment: '자유 게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_post_comment_history ALTER COLUMN action DROP DEFAULT',
    );
    queryRunner.query(
      'ALTER TABLE free_post_comment_history ALTER COLUMN status DROP DEFAULT',
    );

    // 자유게시글 대댓글
    // 관계를 유지할 이유가 없기 때문에 제거
    await queryRunner.dropForeignKey(
      'free_post_reply_comment',
      await this.getForeignKey(
        queryRunner,
        'free_post_reply_comment',
        'free_post',
      ),
    );
    await queryRunner.dropColumn('free_post_reply_comment', 'free_post_id');
    await queryRunner.addColumns('free_post_reply_comment', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [CommonPostStatus.Posting, CommonPostStatus.Remove],
        isNullable: false,
        default: `"${CommonPostStatus.Posting}"`,
        comment: '자유 게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_post_reply_comment ALTER COLUMN status DROP DEFAULT',
    );

    // 관계를 유지할 이유가 없기 때문에 제거
    await queryRunner.dropForeignKey(
      'free_post_reply_comment_history',
      await this.getForeignKey(
        queryRunner,
        'free_post_reply_comment_history',
        'free_post_history',
      ),
    );
    await queryRunner.dropColumn(
      'free_post_reply_comment_history',
      'free_post_history_id',
    );
    await queryRunner.addColumns('free_post_reply_comment_history', [
      new TableColumn({
        name: 'action',
        type: 'enum',
        enum: [
          HistoryAction.Insert,
          HistoryAction.Update,
          HistoryAction.Delete,
        ],
        isNullable: false,
        default: `"${HistoryAction.Insert}"`,
        comment: 'history 를 쌓는 action',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [CommonPostStatus.Posting, CommonPostStatus.Remove],
        isNullable: false,
        default: `"${CommonPostStatus.Posting}"`,
        comment: '자유 게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_post_reply_comment_history ALTER COLUMN action DROP DEFAULT',
    );
    queryRunner.query(
      'ALTER TABLE free_post_reply_comment_history ALTER COLUMN status DROP DEFAULT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 자유 게시글 댓글
    await queryRunner.dropColumns('free_post_comment', [
      'deleted_at',
      'status',
    ]);
    await queryRunner.dropColumns('free_post_comment_history', [
      'action',
      'status',
    ]);
    // 자유게시글 대댓글
    await queryRunner.addColumn(
      'free_post_reply_comment',
      new TableColumn({
        name: 'free_post_id',
        type: 'int',
        isNullable: false,
        unsigned: true,
        comment: '자유게시글 고유 ID',
      }),
    );
    await queryRunner.createForeignKey(
      'free_post_reply_comment',
      new TableForeignKey({
        columnNames: ['free_post_id'],
        referencedTableName: 'free_post',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.dropColumns('free_post_reply_comment', [
      'deleted_at',
      'status',
    ]);
    await queryRunner.addColumn(
      'free_post_reply_comment_history',
      new TableColumn({
        name: 'free_post_history_id',
        type: 'int',
        isNullable: false,
        unsigned: true,
        comment: '자유게시글 수정이력 고유 ID',
      }),
    );
    await queryRunner.createForeignKey(
      'free_post_reply_comment_history',
      new TableForeignKey({
        columnNames: ['free_post_history_id'],
        referencedTableName: 'free_post_history',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
    await queryRunner.dropColumns('free_post_reply_comment_history', [
      'action',
      'status',
    ]);
  }
}
