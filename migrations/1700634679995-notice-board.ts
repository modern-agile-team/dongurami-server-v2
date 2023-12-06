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

const generateUpdatedAtColumn = (
  comment: string = '생성 일자',
): TableColumnOptions => {
  return {
    name: 'updated_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment,
  };
};
export class NoticeBoard1700634679995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 공지 게시판
    await queryRunner.createTable(
      new Table({
        name: 'notice_board',
        columns: [
          generatePrimaryColumn('공지 게시글 고유 ID'),
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
            name: 'hit',
            type: 'int',
            unsigned: true,
            isNullable: false,
            default: 0,
            comment: '조회수',
          },
          {
            name: 'is_allow_comment',
            type: 'tinyint',
            length: '1',
            unsigned: true,
            default: 1,
            isNullable: false,
            comment: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE notice_board COMMENT = "공지 게시판"');

    // 공지 게시글 반응
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_reaction',
        columns: [
          generatePrimaryColumn('공지 게시글 반응 고유 ID'),
          {
            name: 'reaction_type_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '반응 타입 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'notice_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '공지 게시글 고유 ID',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'reaction_type',
            referencedColumnNames: ['id'],
            columnNames: ['reaction_type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_reaction COMMENT = "공지 게시글 반응"',
    );

    // 공지게시글 댓글
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_comment',
        columns: [
          generatePrimaryColumn('공지게시글 댓글 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '댓글 작성 유저 고유 ID',
          },
          {
            name: 'notice_board_id',
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
            type: 'tinyint',
            length: '1',
            default: 0,
            unsigned: true,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_comment COMMENT = "공지 게시판 댓글"',
    );

    // 공지 게시글 댓글 반응
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_comment_reaction',
        columns: [
          generatePrimaryColumn('공지 게시글 댓글 반응 고유 ID'),
          {
            name: 'reaction_type_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '반응 타입 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'notice_board_comment_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '공지 게시글 댓글 고유 ID',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'reaction_type',
            referencedColumnNames: ['id'],
            columnNames: ['reaction_type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board_comment',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_comment_reaction COMMENT = "공지 게시글 댓글 반응"',
    );

    // 공지 게시글 대댓글
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_reply_comment',
        columns: [
          generatePrimaryColumn('공지 게시글 대댓글 고유 ID'),
          {
            name: 'notice_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 고유 ID',
          },
          {
            name: 'notice_board_comment_id',
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
            type: 'tinyint',
            length: '1',
            default: 0,
            unsigned: true,
            isNullable: false,
            comment: '작성자 익명 여부 (0: 실명, 1: 익명)',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board_comment',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_reply_comment COMMENT = "공지 게시판 대댓글"',
    );

    // 공지 게시글 대댓글 반응
    await queryRunner.createTable(
      new Table({
        name: 'notice_board_reply_comment_reaction',
        columns: [
          generatePrimaryColumn('공지 게시글 대댓글 반응 고유 ID'),
          {
            name: 'reaction_type_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '반응 타입 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'notice_board_reply_comment_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '공지 게시글 대댓글 고유 ID',
          },
          generateCreatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'reaction_type',
            referencedColumnNames: ['id'],
            columnNames: ['reaction_type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'notice_board_reply_comment',
            referencedColumnNames: ['id'],
            columnNames: ['notice_board_reply_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE notice_board_reply_comment_reaction COMMENT = "공지 게시글 대댓글 반응"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({ name: 'notice_board_reply_comment_reaction' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'notice_board_reply_comment' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'notice_board_comment_reaction' }),
    );
    await queryRunner.dropTable(new Table({ name: 'notice_board_comment' }));
    await queryRunner.dropTable(new Table({ name: 'notice_board_reaction' }));
    await queryRunner.dropTable(new Table({ name: 'notice_board' }));
  }
}
