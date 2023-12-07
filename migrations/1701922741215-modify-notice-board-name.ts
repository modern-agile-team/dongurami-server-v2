import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNoticeBoardName1701922741215 implements MigrationInterface {
  getNewName(name: string): string {
    return name.replace('board', 'post');
  }

  notice_board = 'notice_board';
  notice_board_id = 'notice_board_id';
  notice_board_history = 'notice_board_history';
  notice_board_history_id = 'notice_board_history_id';
  notice_board_reaction = 'notice_board_reaction';

  notice_board_comment = 'notice_board_comment';
  notice_board_comment_history = 'notice_board_comment_history';
  notice_board_comment_history_id = 'notice_board_comment_history_id';
  notice_board_comment_reaction = 'notice_board_comment_reaction';
  notice_board_comment_id = 'notice_board_comment_id';

  notice_board_reply_comment = 'notice_board_reply_comment';
  notice_board_reply_comment_history = 'notice_board_reply_comment_history';
  notice_board_reply_comment_reaction = 'notice_board_reply_comment_reaction';
  notice_board_reply_comment_id = 'notice_board_reply_comment_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공지게시글
    await queryRunner.renameTable(
      this.notice_board,
      this.getNewName(this.notice_board),
    );
    // 공지게시글 수정이력
    await queryRunner.renameTable(
      this.notice_board_history,
      this.getNewName(this.notice_board_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_history),
      this.notice_board_id,
      this.getNewName(this.notice_board_id),
    );
    // 공지게시글 리액션
    await queryRunner.renameTable(
      this.notice_board_reaction,
      this.getNewName(this.notice_board_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reaction),
      this.notice_board_id,
      this.getNewName(this.notice_board_id),
    );

    // 공지게시글 댓글
    await queryRunner.renameTable(
      this.notice_board_comment,
      this.getNewName(this.notice_board_comment),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_comment),
      this.notice_board_id,
      this.getNewName(this.notice_board_id),
    );
    // 공지게시글 댓글 수정이력
    await queryRunner.renameTable(
      this.notice_board_comment_history,
      this.getNewName(this.notice_board_comment_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_comment_history),
      this.notice_board_history_id,
      this.getNewName(this.notice_board_history_id),
    );
    // 공지게시글 댓글 리액션
    await queryRunner.renameTable(
      this.notice_board_comment_reaction,
      this.getNewName(this.notice_board_comment_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_comment_reaction),
      this.notice_board_comment_id,
      this.getNewName(this.notice_board_comment_id),
    );

    // 공지게시글 대댓글
    await queryRunner.renameTable(
      this.notice_board_reply_comment,
      this.getNewName(this.notice_board_reply_comment),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reply_comment),
      this.notice_board_id,
      this.getNewName(this.notice_board_id),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reply_comment),
      this.notice_board_comment_id,
      this.getNewName(this.notice_board_comment_id),
    );
    // 공지게시글 대댓글 수정이력
    await queryRunner.renameTable(
      this.notice_board_reply_comment_history,
      this.getNewName(this.notice_board_reply_comment_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reply_comment_history),
      this.notice_board_history_id,
      this.getNewName(this.notice_board_history_id),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reply_comment_history),
      this.notice_board_comment_history_id,
      this.getNewName(this.notice_board_comment_history_id),
    );
    // 공지게시글 대댓글 리액션
    await queryRunner.renameTable(
      this.notice_board_reply_comment_reaction,
      this.getNewName(this.notice_board_reply_comment_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.notice_board_reply_comment_reaction),
      this.notice_board_reply_comment_id,
      this.getNewName(this.notice_board_reply_comment_id),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 공지게시글
    await queryRunner.renameTable(
      this.getNewName(this.notice_board),
      this.notice_board,
    );
    // 공지게시글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_history),
      this.notice_board_history,
    );
    await queryRunner.renameColumn(
      this.notice_board_history,
      this.getNewName(this.notice_board_id),
      this.notice_board_id,
    );
    // 공지게시글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_reaction),
      this.notice_board_reaction,
    );
    await queryRunner.renameColumn(
      this.notice_board_reaction,
      this.getNewName(this.notice_board_id),
      this.notice_board_id,
    );

    // 공지게시글 댓글
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_comment),
      this.notice_board_comment,
    );
    await queryRunner.renameColumn(
      this.notice_board_comment,
      this.getNewName(this.notice_board_id),
      this.notice_board_id,
    );
    // 공지게시글 댓글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_comment_history),
      this.notice_board_comment_history,
    );
    await queryRunner.renameColumn(
      this.notice_board_comment_history,
      this.getNewName(this.notice_board_history_id),
      this.notice_board_history_id,
    );
    // 공지게시글 댓글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_comment_reaction),
      this.notice_board_comment_reaction,
    );
    await queryRunner.renameColumn(
      this.notice_board_comment_reaction,
      this.getNewName(this.notice_board_comment_id),
      this.notice_board_comment_id,
    );

    // 공지게시글 대댓글
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_reply_comment),
      this.notice_board_reply_comment,
    );
    await queryRunner.renameColumn(
      this.notice_board_reply_comment,
      this.getNewName(this.notice_board_id),
      this.notice_board_id,
    );
    await queryRunner.renameColumn(
      this.notice_board_reply_comment,
      this.getNewName(this.notice_board_comment_id),
      this.notice_board_comment_id,
    );
    // 공지게시글 대댓글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_reply_comment_history),
      this.notice_board_reply_comment_history,
    );
    await queryRunner.renameColumn(
      this.notice_board_reply_comment_history,
      this.getNewName(this.notice_board_history_id),
      this.notice_board_history_id,
    );
    await queryRunner.renameColumn(
      this.notice_board_reply_comment_history,
      this.getNewName(this.notice_board_comment_history_id),
      this.notice_board_comment_history_id,
    );
    // 공지게시글 대댓글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.notice_board_reply_comment_reaction),
      this.notice_board_reply_comment_reaction,
    );
    await queryRunner.renameColumn(
      this.notice_board_reply_comment_reaction,
      this.getNewName(this.notice_board_reply_comment_id),
      this.notice_board_reply_comment_id,
    );
  }
}
