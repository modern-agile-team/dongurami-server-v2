import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyFreeBoardName1701757608194 implements MigrationInterface {
  getNewName(name: string): string {
    return name.replace('board', 'post');
  }

  free_board = 'free_board';
  free_board_id = 'free_board_id';
  free_board_history = 'free_board_history';
  free_board_history_id = 'free_board_history_id';
  free_board_reaction = 'free_board_reaction';

  free_board_comment = 'free_board_comment';
  free_board_comment_history = 'free_board_comment_history';
  free_board_comment_history_id = 'free_board_comment_history_id';
  free_board_comment_reaction = 'free_board_comment_reaction';
  free_board_comment_id = 'free_board_comment_id';

  free_board_reply_comment = 'free_board_reply_comment';
  free_board_reply_comment_history = 'free_board_reply_comment_history';
  free_board_reply_comment_reaction = 'free_board_reply_comment_reaction';
  free_board_reply_comment_id = 'free_board_reply_comment_id';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 자유게시글
    await queryRunner.renameTable(
      this.free_board,
      this.getNewName(this.free_board),
    );
    // 자유게시글 수정이력
    await queryRunner.renameTable(
      this.free_board_history,
      this.getNewName(this.free_board_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_history),
      this.free_board_id,
      this.getNewName(this.free_board_id),
    );
    // 자유게시글 리액션
    await queryRunner.renameTable(
      this.free_board_reaction,
      this.getNewName(this.free_board_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reaction),
      this.free_board_id,
      this.getNewName(this.free_board_id),
    );

    // 자유게시글 댓글
    await queryRunner.renameTable(
      this.free_board_comment,
      this.getNewName(this.free_board_comment),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_comment),
      this.free_board_id,
      this.getNewName(this.free_board_id),
    );
    // 자유게시글 댓글 수정이력
    await queryRunner.renameTable(
      this.free_board_comment_history,
      this.getNewName(this.free_board_comment_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_comment_history),
      this.free_board_history_id,
      this.getNewName(this.free_board_history_id),
    );
    // 자유게시글 댓글 리액션
    await queryRunner.renameTable(
      this.free_board_comment_reaction,
      this.getNewName(this.free_board_comment_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_comment_reaction),
      this.free_board_comment_id,
      this.getNewName(this.free_board_comment_id),
    );

    // 자유게시글 대댓글
    await queryRunner.renameTable(
      this.free_board_reply_comment,
      this.getNewName(this.free_board_reply_comment),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reply_comment),
      this.free_board_id,
      this.getNewName(this.free_board_id),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reply_comment),
      this.free_board_comment_id,
      this.getNewName(this.free_board_comment_id),
    );
    // 자유게시글 대댓글 수정이력
    await queryRunner.renameTable(
      this.free_board_reply_comment_history,
      this.getNewName(this.free_board_reply_comment_history),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reply_comment_history),
      this.free_board_history_id,
      this.getNewName(this.free_board_history_id),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reply_comment_history),
      this.free_board_comment_history_id,
      this.getNewName(this.free_board_comment_history_id),
    );
    // 자유게시글 대댓글 리액션
    await queryRunner.renameTable(
      this.free_board_reply_comment_reaction,
      this.getNewName(this.free_board_reply_comment_reaction),
    );
    await queryRunner.renameColumn(
      this.getNewName(this.free_board_reply_comment_reaction),
      this.free_board_reply_comment_id,
      this.getNewName(this.free_board_reply_comment_id),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 자유게시글
    await queryRunner.renameTable(
      this.getNewName(this.free_board),
      this.free_board,
    );
    // 자유게시글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.free_board_history),
      this.free_board_history,
    );
    await queryRunner.renameColumn(
      this.free_board_history,
      this.getNewName(this.free_board_id),
      this.free_board_id,
    );
    // 자유게시글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.free_board_reaction),
      this.free_board_reaction,
    );
    await queryRunner.renameColumn(
      this.free_board_reaction,
      this.getNewName(this.free_board_id),
      this.free_board_id,
    );

    // 자유게시글 댓글
    await queryRunner.renameTable(
      this.getNewName(this.free_board_comment),
      this.free_board_comment,
    );
    await queryRunner.renameColumn(
      this.free_board_comment,
      this.getNewName(this.free_board_id),
      this.free_board_id,
    );
    // 자유게시글 댓글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.free_board_comment_history),
      this.free_board_comment_history,
    );
    await queryRunner.renameColumn(
      this.free_board_comment_history,
      this.getNewName(this.free_board_history_id),
      this.free_board_history_id,
    );
    // 자유게시글 댓글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.free_board_comment_reaction),
      this.free_board_comment_reaction,
    );
    await queryRunner.renameColumn(
      this.free_board_comment_reaction,
      this.getNewName(this.free_board_comment_id),
      this.free_board_comment_id,
    );

    // 자유게시글 대댓글
    await queryRunner.renameTable(
      this.getNewName(this.free_board_reply_comment),
      this.free_board_reply_comment,
    );
    await queryRunner.renameColumn(
      this.free_board_reply_comment,
      this.getNewName(this.free_board_id),
      this.free_board_id,
    );
    await queryRunner.renameColumn(
      this.free_board_reply_comment,
      this.getNewName(this.free_board_comment_id),
      this.free_board_comment_id,
    );
    // 자유게시글 대댓글 수정이력
    await queryRunner.renameTable(
      this.getNewName(this.free_board_reply_comment_history),
      this.free_board_reply_comment_history,
    );
    await queryRunner.renameColumn(
      this.free_board_reply_comment_history,
      this.getNewName(this.free_board_history_id),
      this.free_board_history_id,
    );
    await queryRunner.renameColumn(
      this.free_board_reply_comment_history,
      this.getNewName(this.free_board_comment_history_id),
      this.free_board_comment_history_id,
    );
    // 자유게시글 대댓글 리액션
    await queryRunner.renameTable(
      this.getNewName(this.free_board_reply_comment_reaction),
      this.free_board_reply_comment_reaction,
    );
    await queryRunner.renameColumn(
      this.free_board_reply_comment_reaction,
      this.getNewName(this.free_board_reply_comment_id),
      this.free_board_reply_comment_id,
    );
  }
}
