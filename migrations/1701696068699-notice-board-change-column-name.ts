import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class NoticeBoardChangeColumnName1701696068699
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'notice_board',
      'allow_comment',
      new TableColumn({
        name: 'is_allow_comment',
        type: 'boolean',
        default: true,
        isNullable: false,
        comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_comment',
      'isAnonymous',
      new TableColumn({
        name: 'is_anonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_reply_comment',
      'isAnonymous',
      new TableColumn({
        name: 'is_anonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_history',
      'allow_comment',
      new TableColumn({
        name: 'is_allow_comment',
        type: 'boolean',
        default: true,
        isNullable: false,
        comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_comment_history',
      'isAnonymous',
      new TableColumn({
        name: 'is_anonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_reply_comment_history',
      'isAnonymous',
      new TableColumn({
        name: 'is_anonymous',
        type: 'tinyint',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'notice_board',
      'is_allow_comment',
      new TableColumn({
        name: 'allow_comment',
        type: 'boolean',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_comment',
      'is_anonymous',
      new TableColumn({
        name: 'isAnonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_reply_comment',
      'is_anonymous',
      new TableColumn({
        name: 'isAnonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_history',
      'is_allow_comment',
      new TableColumn({
        name: 'allow_comment',
        type: 'boolean',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_comment_history',
      'is_anonymous',
      new TableColumn({
        name: 'isAnonymous',
        type: 'tinyint',
      }),
    );

    await queryRunner.changeColumn(
      'notice_board_reply_comment_history',
      'is_anonymous',
      new TableColumn({
        name: 'isAnonymous',
        type: 'tinyint',
      }),
    );
  }
}
