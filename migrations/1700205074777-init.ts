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

export class Init1700205074777 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 로그인 타입
    await queryRunner.createTable(
      new Table({
        name: 'login_type',
        columns: [
          generatePrimaryColumn('로그인 타입 고유 ID'),
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '로그인 타입',
          },
          {
            name: 'memo',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '메모',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE login_type COMMENT = "로그인 타입"');

    // 전공
    await queryRunner.createTable(
      new Table({
        name: 'major',
        columns: [
          generatePrimaryColumn('전공 고유 ID'),
          {
            name: 'code',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '전공 코드',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: '전공 명',
          },
          {
            name: 'memo',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '메모',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE major COMMENT = "전공"');

    // 유저
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          generatePrimaryColumn('유저 고유 ID'),
          {
            name: 'login_type_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '로그인 타입 고유 ID',
          },
          {
            name: 'major_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '로그인 타입 고유 ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '유저 이름',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '128',
            isNullable: true,
            comment: '비밀번호',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '이메일',
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '전화번호',
          },
          {
            name: 'grade',
            type: 'tinyint',
            length: '1',
            isNullable: true,
            comment: '학년 (0이면 졸업생)',
          },
          {
            name: 'gender',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '성별',
          },
          {
            name: 'profile_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '프로필 이미지 path',
          },
          {
            name: 'role',
            type: 'enum',
            isNullable: false,
            enum: ['admin', 'student'],
            default: '"student"',
            comment: '역할 (admin: service admin, student: 학생)',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'login_type',
            referencedColumnNames: ['id'],
            columnNames: ['login_type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'major',
            referencedColumnNames: ['id'],
            columnNames: ['major_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE user COMMENT = "유저"');

    // 동아리 카테고리
    await queryRunner.createTable(
      new Table({
        name: 'club_category',
        columns: [
          generatePrimaryColumn('동아리 카테고리 고유 ID'),
          {
            name: 'name',
            type: 'varchar',
            length: '30',
            isNullable: false,
            comment: '동아리 카테고리 명',
          },
          {
            name: 'memo',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '메모',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE club_category COMMENT = "동아리 카테고리"',
    );

    // 동아리
    await queryRunner.createTable(
      new Table({
        name: 'club',
        columns: [
          generatePrimaryColumn(),
          {
            name: 'club_category_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 카테고리 고유 ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '30',
            isNullable: false,
            comment: '동아리 명',
          },
          {
            name: 'logo_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '동아리 로고 path',
          },
          {
            name: 'introduce',
            type: 'text',
            isNullable: true,
            comment: '동아리 소개',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'club_category',
            referencedColumnNames: ['id'],
            columnNames: ['club_category_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE club COMMENT = "동아리"');

    // 동아리 멤버
    await queryRunner.createTable(
      new Table({
        name: 'club_member',
        columns: [
          generatePrimaryColumn('동아리 구성원 고유 ID'),
          {
            name: 'club_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'role',
            type: 'varchar',
            length: '20',
            isNullable: false,
            comment: '동아리 멤버 역할',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            columnNames: ['club_id'],
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
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE club_member COMMENT = "동아리 멤버"');

    // 동아리 신청
    await queryRunner.createTable(
      new Table({
        name: 'club_join_application',
        columns: [
          generatePrimaryColumn('동아리 가입 신청 고유 ID'),
          {
            name: 'club_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'status',
            type: 'enum',
            isNullable: false,
            enum: ['pending', 'resolve', 'reject'],
            default: '"pending"',
            comment: '지원서 상태 (pending: 대기, resolve: 승인, reject: 거절)',
          },
          {
            name: 'reject_reason',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '거절 사유 (사용하지 않을 수 있음)',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            columnNames: ['club_id'],
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
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE club_join_application COMMENT = "동아리 가입 신청서"',
    );

    // 반응 타입
    await queryRunner.createTable(
      new Table({
        name: 'reaction_type',
        columns: [
          generatePrimaryColumn('반응 타입 고유 ID'),
          {
            name: 'name',
            type: 'varchar',
            length: '30',
            isNullable: false,
            comment: '반응 타입',
          },
          {
            name: 'memo',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '메모',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE reaction_type COMMENT = "반응 타입"');

    // 자유 게시글
    await queryRunner.createTable(
      new Table({
        name: 'free_board',
        columns: [
          generatePrimaryColumn('자유 게시글 고유 ID'),
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
            name: 'hit',
            type: 'int',
            unsigned: true,
            isNullable: false,
            default: 0,
            comment: '조회수',
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
    await queryRunner.query('ALTER TABLE free_board COMMENT = "자유 게시판"');

    // 자유 게시글 반응
    await queryRunner.createTable(
      new Table({
        name: 'free_board_reaction',
        columns: [
          generatePrimaryColumn('자유 게시글 반응 고유 ID'),
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
            name: 'free_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유 게시글 고유 ID',
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
            referencedTableName: 'free_board',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_reaction COMMENT = "자유 게시글 반응"',
    );

    // 자유게시글 댓글
    await queryRunner.createTable(
      new Table({
        name: 'free_board_comment',
        columns: [
          generatePrimaryColumn('자유게시글 댓글 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '댓글 작성 유저 고유 ID',
          },
          {
            name: 'free_board_id',
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
            referencedTableName: 'free_board',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_comment COMMENT = "자유 게시판 댓글"',
    );

    // 자유 게시글 댓글 반응
    await queryRunner.createTable(
      new Table({
        name: 'free_board_comment_reaction',
        columns: [
          generatePrimaryColumn('자유 게시글 댓글 반응 고유 ID'),
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
            name: 'free_board_comment_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유 게시글 댓글 고유 ID',
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
            referencedTableName: 'free_board_comment',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_comment_reaction COMMENT = "자유 게시글 댓글 반응"',
    );

    // 자유 게시글 대댓글
    await queryRunner.createTable(
      new Table({
        name: 'free_board_reply_comment',
        columns: [
          generatePrimaryColumn('자유 게시글 대댓글 고유 ID'),
          {
            name: 'free_board_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '게시글 고유 ID',
          },
          {
            name: 'free_board_comment_id',
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
            referencedTableName: 'free_board',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            referencedTableName: 'free_board_comment',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_reply_comment COMMENT = "자유 게시판 대댓글"',
    );

    // 자유 게시글 대댓글 반응
    await queryRunner.createTable(
      new Table({
        name: 'free_board_reply_comment_reaction',
        columns: [
          generatePrimaryColumn('자유 게시글 대댓글 반응 고유 ID'),
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
            name: 'free_board_reply_comment_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '자유 게시글 대댓글 고유 ID',
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
            referencedTableName: 'free_board_reply_comment',
            referencedColumnNames: ['id'],
            columnNames: ['free_board_reply_comment_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query(
      'ALTER TABLE free_board_reply_comment_reaction COMMENT = "자유 게시글 대댓글 반응"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({ name: 'free_board_reply_comment_reaction' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'free_board_reply_comment' }),
    );
    await queryRunner.dropTable(
      new Table({ name: 'free_board_comment_reaction' }),
    );
    await queryRunner.dropTable(new Table({ name: 'free_board_comment' }));
    await queryRunner.dropTable(new Table({ name: 'free_board_reaction' }));
    await queryRunner.dropTable(new Table({ name: 'free_board' }));
    await queryRunner.dropTable(new Table({ name: 'reaction_type' }));

    await queryRunner.dropTable(new Table({ name: 'club_join_application' }));
    await queryRunner.dropTable(new Table({ name: 'club_member' }));
    await queryRunner.dropTable(new Table({ name: 'club' }));
    await queryRunner.dropTable(new Table({ name: 'club_category' }));

    await queryRunner.dropTable(new Table({ name: 'user' }));
    await queryRunner.dropTable(new Table({ name: 'login_type' }));
    await queryRunner.dropTable(new Table({ name: 'major' }));
  }
}
