import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { HistoryAction } from '@src/constants/enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class NoticeBoardSoftDelete1701700089002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('notice_board', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [NoticePostStatus.Posting, NoticePostStatus.Remove],
        isNullable: false,
        default: `"${NoticePostStatus.Posting}"`,
        comment: '공지게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE notice_board ALTER COLUMN status DROP DEFAULT',
    );

    await queryRunner.addColumns('notice_board_history', [
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
        enum: [NoticePostStatus.Posting, NoticePostStatus.Remove],
        default: `"${NoticePostStatus.Posting}"`,
        isNullable: false,
        comment: '공지게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE notice_board_history ALTER COLUMN action DROP DEFAULT',
    );
    queryRunner.query(
      'ALTER TABLE notice_board_history ALTER COLUMN status DROP DEFAULT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('notice_board', [
      new TableColumn({ name: 'deleted_at', type: 'timestamp' }),
      new TableColumn({ name: 'status', type: 'enum' }),
    ]);
    await queryRunner.dropColumns('notice_board_history', [
      new TableColumn({ name: 'action', type: 'enum' }),
      new TableColumn({ name: 'status', type: 'enum' }),
    ]);
  }
}
