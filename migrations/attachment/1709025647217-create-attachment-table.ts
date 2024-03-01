import { generateCreatedAtColumn } from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateAttachmentTable1709025647217 implements MigrationInterface {
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
            length: '18',
            unsigned: true,
            comment: '첨부 파일 고유 ID',
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
            length: '100',
            comment: 'file url',
          }),
          new TableColumn({
            name: 'path',
            isNullable: false,
            type: 'varchar',
            length: '18',
            comment: 'domain을 제외한 path',
          }),
          new TableColumn({
            name: 'mime_type',
            isNullable: false,
            length: '30',
            type: 'varchar',
            comment: 'MIME-Type',
          }),
          new TableColumn({
            name: 'capacity',
            isNullable: false,
            unsigned: true,
            type: 'int',
            comment: '파일 용량(byte)',
          }),
          generateCreatedAtColumn(),
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
