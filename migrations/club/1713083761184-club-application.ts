import {
  generateCreatedAtColumn,
  generateDeletedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubApplication1713083761184 implements MigrationInterface {
  name?: string;
  transaction?: boolean;
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_application',
        columns: [
          generatePrimaryColumn('동아리 지원서'),
          {
            name: 'club_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'user_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '지원 유저 고유 ID',
          },
          {
            name: 'answers',
            type: 'json',
            isNullable: false,
            comment: '동아리 지원서 답변',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['submit', 'viewed', 'accept', 'reject'],
          },
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
          generateDeletedAtColumn(),
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
      'ALTER TABLE club_application COMMENT = "동아리 지원서"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_application');
  }
}
