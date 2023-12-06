import { UserStatus } from '@src/apis/users/constants/user.enum';
import { HistoryAction } from '@src/constants/enum';
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

export class UserHistory1701678486841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 유저 히스토리
    await queryRunner.createTable(
      new Table({
        name: 'user_history',
        columns: [
          generatePrimaryColumn('유저 히스토리 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '유저 고유 ID',
          },
          {
            name: 'major_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '전공 고유 ID',
          },
          {
            name: 'action',
            type: 'enum',
            enum: [
              HistoryAction.Insert,
              HistoryAction.Update,
              HistoryAction.Delete,
            ],
            isNullable: false,
            comment: 'history 를 쌓는 action',
          },
          {
            name: 'login_type',
            type: 'enum',
            enum: ['email'],
            isNullable: false,
            comment: '로그인 타입',
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
          {
            name: 'status',
            type: 'enum',
            enum: [UserStatus.Active, UserStatus.Inactive],
            isNullable: false,
            comment: '유저 상태',
          },
          generateCreatedAtColumn(),
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
            referencedTableName: 'major',
            referencedColumnNames: ['id'],
            columnNames: ['major_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_history');
  }
}
