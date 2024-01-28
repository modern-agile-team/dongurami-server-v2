import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class User1706436836635 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          generatePrimaryColumn('유저 고유 ID'),
          {
            name: 'user_major_id',
            type: 'int',
            unsigned: true,
            isNullable: true,
            comment: '전공 고유 ID',
          },
          {
            name: 'login_type',
            type: 'enum',
            enum: ['KAKAO', 'GOOGLE', 'NAVER'],
            isNullable: false,
            comment: '로그인 타입',
          },
          {
            name: 'sns_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true,
            comment: '소셜 아이디',
          },
          {
            name: 'student_number',
            type: 'varchar',
            length: '20',
            isNullable: true,
            isUnique: true,
            comment: '유저 학번',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: '본명을 기대하는 유저 이름',
          },
          {
            name: 'nickname',
            type: 'varchar',
            length: '255',
            isNullable: true,
            isUnique: true,
            comment: '유저 닉네임',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
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
            enum: ['active', 'inactive'],
            isNullable: false,
            default: `"active"`,
            comment: '유저 상태',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedTableName: 'user_major',
            referencedColumnNames: ['id'],
            columnNames: ['user_major_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
    await queryRunner.query('ALTER TABLE user COMMENT = "유저"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(new Table({ name: 'user' }));
  }
}
