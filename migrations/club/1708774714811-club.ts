import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Club1708774714811 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club',
        columns: [
          generatePrimaryColumn('동아리 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 생성 유저 고유 ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: '동아리 명',
          },
          {
            name: 'introduce',
            type: 'text',
            isNullable: true,
            comment: '동아리 소개',
          },
          {
            name: 'logo_path',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: '동아리 로고 경로',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['pending', 'active', 'inactive'],
            isNullable: false,
            default: `"pending"`,
            comment: '동아리 상태',
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
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
    await queryRunner.query('ALTER TABLE club COMMENT = "동아리"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club');
  }
}
