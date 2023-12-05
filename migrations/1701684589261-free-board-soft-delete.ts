import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { HistoryAction } from '@src/constants/enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FreeBoardSoftDelete1701684589261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('free_board', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [FreePostStatus.Posting, FreePostStatus.Remove],
        isNullable: false,
        default: `"${FreePostStatus.Posting}"`,
        comment: '자유게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_board ALTER COLUMN status DROP DEFAULT',
    );

    await queryRunner.addColumns('free_board_history', [
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
        enum: [FreePostStatus.Posting, FreePostStatus.Remove],
        default: `"${FreePostStatus.Posting}"`,
        isNullable: false,
        comment: '자유게시글 상태',
      }),
    ]);
    queryRunner.query(
      'ALTER TABLE free_board_history ALTER COLUMN action DROP DEFAULT',
    );
    queryRunner.query(
      'ALTER TABLE free_board_history ALTER COLUMN status DROP DEFAULT',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('free_board', [
      new TableColumn({ name: 'deleted_at', type: 'timestamp' }),
      new TableColumn({ name: 'status', type: 'enum' }),
    ]);
    await queryRunner.dropColumns('free_board_history', [
      new TableColumn({ name: 'action', type: 'enum' }),
      new TableColumn({ name: 'status', type: 'enum' }),
    ]);
  }
}
