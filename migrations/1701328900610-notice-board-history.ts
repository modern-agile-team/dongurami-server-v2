import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions,
} from 'typeorm';

const generatePrimaryColumn = (
  comment: string = '고유 ID',
): TableColumnOptions => {
  return {
    name: 'id',
    type: 'int',
    unsigned: true,
    isPrimary: true,
    isNullable: false,
    isGenerated: true,
    generationStrategy: 'increment',
    comment,
  };
};

const generateCreatedAtColumn = (
  comment: string = '생성 일자',
): TableColumnOptions => {
  return {
    name: 'created_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    comment,
  };
};

export class NoticeBoardHistory1701328900610 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공지게시글 히스토리
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_history',
        columns: [
          generatePrimaryColumn('공지 게시글 히스토리 고유 ID'),
          {
            name: 'notice_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '공지 게시글 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 작성 유저 고유 ID',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '공지게시글 제목',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
            comment: '공지게시글 내용',
          },
          {
            name: 'is_allow_comment',
            type: 'boolean',
            default: 1,
            isNullable: false,
            comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'notice_board',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_history COMMENT = "공지 게시판 수정이력"',
    );

    // 공지게시글 댓글 수정이력
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_comment_history',
        columns: [
          generatePrimaryColumn('공지게시글 댓글 수정이력 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '댓글 작성 유저 고유 ID',
          },
          {
            name: 'notice_board_history_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 고유 ID',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '댓글 본문',
          },
          {
            name: 'is_anonymous',
            type: 'boolean',
            default: 0,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
          {
            referencedTableName: 'notice_board_history',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_comment_history COMMENT = "공지 게시글 댓글 수정이력"',
    );

    // 공지 게시글 대댓글 수정이력
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_reply_comment_history',
        columns: [
          generatePrimaryColumn('공지 게시글 대댓글 수정이력 고유 ID'),
          {
            name: 'notice_board_history_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 고유 ID',
          },
          {
            name: 'notice_board_comment_history_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '공지 게시글 댓글 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '대댓글 작성 유저 고유 ID',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '대댓글 본문',
          },
          {
            name: 'is_anonymous',
            type: 'boolean',
            default: 0,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
          {
            referencedTableName: 'notice_board_history',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
          {
            referencedTableName: 'notice_board_comment_history',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_comment_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_reply_comment_history COMMENT = "공지 게시판 대댓글 수정이력"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({ name: 'notice_board_reply_comment_history' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'notice_board_comment_history' }),
    );
    await queryRunner.dropTable(new Table({ name: 'notice_board_history' }));
  }
}
