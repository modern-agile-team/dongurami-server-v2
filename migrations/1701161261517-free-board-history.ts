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

export class FreeBoardHistory1701161261517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 자유게시글 히스토리
    await queryRunner.createTable(
      new Table({
        name: 'free_board_history',
        columns: [
          generatePrimaryColumn('자유 게시글 히스토리 고유 ID'),
          {
            name: 'free_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유 게시글 고유 ID',
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
            comment: '자유게시글 제목',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
            comment: '자유게시글 내용',
          },
          {
            name: 'isAnonymous',
            type: 'tinyint',
            length: '1',
            unsigned: true,
            default: 0,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'free_board',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_id'],
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
      'ALTER TABLE free_board_history COMMENT = "자유 게시판 수정이력"',
    );

    // 자유게시글 댓글 수정이력
    await queryRunner.createTable(
      new Table({
        name: 'free_board_comment_history',
        columns: [
          generatePrimaryColumn('자유게시글 댓글 수정이력 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '댓글 작성 유저 고유 ID',
          },
          {
            name: 'free_board_history_id',
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
            name: 'isAnonymous',
            type: 'tinyint',
            length: '1',
            default: 0,
            unsigned: true,
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
            referencedTableName: 'free_board_history',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_comment_history COMMENT = "자유 게시글 댓글 수정이력"',
    );

    // 자유 게시글 대댓글
    await queryRunner.createTable(
      new Table({
        name: 'free_board_reply_comment_history',
        columns: [
          generatePrimaryColumn('자유 게시글 대댓글 고유 ID'),
          {
            name: 'free_board_history_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 고유 ID',
          },
          {
            name: 'free_board_comment_history_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유 게시글 댓글 고유 ID',
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
            name: 'isAnonymous',
            type: 'tinyint',
            length: '1',
            default: 0,
            unsigned: true,
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
            referencedTableName: 'free_board_history',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
          {
            referencedTableName: 'free_board_comment_history',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_comment_history_id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_reply_comment_history COMMENT = "자유 게시판 대댓글 수정이력"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({ name: 'free_board_reply_comment_history' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'free_board_comment_history' }),
    );
    await queryRunner.dropTable(new Table({ name: 'free_board_history' }));
  }
}
