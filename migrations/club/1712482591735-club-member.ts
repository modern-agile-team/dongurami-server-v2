import {
  generateCreatedAtColumn,
  generatePrimaryColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubMember1712482591735 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'club_member',
        columns: [
          generatePrimaryColumn('동아리 구성원'),
          {
            name: 'user_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '동아리 구성원 유저 고유 ID',
          },
          {
            name: 'club_id',
            type: 'bigint',
            unsigned: true,
            isNullable: false,
            comment: '동아리 고유 ID',
          },
          {
            name: 'roles',
            type: 'json',
            isNullable: false,
            comment: '구성원의 역할 리스트',
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
            referencedTableName: 'club',
            referencedColumnNames: ['id'],
            columnNames: ['club_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE club_member COMMENT = "동아리 구성원"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_member');
  }
}
