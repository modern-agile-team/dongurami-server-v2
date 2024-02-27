import {
  generateCreatedAtColumn,
  generateUpdatedAtColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateImageTable1709025647217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'attachment',
        columns: [
          new TableColumn({
            name: 'id',
            isNullable: false,
            isPrimary: true,
            type: 'bigint',
            unsigned: true,
            comment: '파일 고유 ID',
          }),
          new TableColumn({
            name: 'user_id',
            isNullable: false,
            unsigned: true,
            type: 'int',
            comment: '업로더 고유 ID',
          }),
          new TableColumn({
            name: 'url',
            isNullable: false,
            type: 'varchar',
            comment: 'image url',
          }),
          new TableColumn({
            name: 'path',
            isNullable: false,
            type: 'varchar',
            comment: 'domain을 제외한 path',
          }),
          new TableColumn({
            name: 'mime_type',
            isNullable: false,
            type: 'varchar',
            comment: 'MIME-Type',
          }),
          new TableColumn({
            name: 'capacity',
            isNullable: false,
            type: 'varchar',
            comment: '파일 용량(byte)',
          }),
          generateCreatedAtColumn(),
          generateUpdatedAtColumn(),
        ],
        foreignKeys: [
          {
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            columnNames: ['user_id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('attachment');
  }
}
