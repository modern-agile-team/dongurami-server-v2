import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubCategory1708778638574 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_category',
        columns: [
          generatePrimaryColumn('동아리 카테고리 고유 ID'),
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
            comment: '동아리 카테고리 생성 유저 고유 ID',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
            isUnique: true,
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
    await queryRunner.query(
      'ALTER TABLE club_category COMMENT = "동아리 카테고리"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_category');
  }
}
