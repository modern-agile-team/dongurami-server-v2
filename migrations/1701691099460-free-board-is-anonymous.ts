import { MigrationInterface, QueryRunner } from 'typeorm';

export class FreeBoardIsAnonymous1701691099460 implements MigrationInterface {
  TABLE_NAMES = [
    'free_board',
    'free_board_history',
    'free_board_comment',
    'free_board_comment_history',
    'free_board_reply_comment',
    'free_board_reply_comment_history',
  ];

  OLD_COLUMN_NAME = 'isAnonymous';
  NEW_COLUMN_NAME = 'is_anonymous';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.TABLE_NAMES.map((tableName) => {
        return queryRunner.renameColumn(
          tableName,
          this.OLD_COLUMN_NAME,
          this.NEW_COLUMN_NAME,
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.TABLE_NAMES.map((tableName) => {
        return queryRunner.renameColumn(
          tableName,
          this.NEW_COLUMN_NAME,
          this.OLD_COLUMN_NAME,
        );
      }),
    );
  }
}
