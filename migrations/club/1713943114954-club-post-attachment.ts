import {
  generateCreatedAtColumn,
  generateFkColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class ClubPostAttachment1713943114954 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const [clubPostColumn, clubPostFk] = generateFkColumn(
      'club_post',
      '동아리 게시글 고유 ID',
    );

    await queryRunner.createTable(
      new Table({
        name: 'club_post_attachment',
        columns: [
          new TableColumn({
            /**
             * @todo 현재 attachment 테이블의 path 컬럼은 index가 존재하지 않아서 외래 키를 생성하지 못함.
             * 추후 url 혹은 path 중 어떤 것에 index를 생성할 것인지에 대해서 정해지면 그에 맞게 컬럼명 수정 및 외래키 생성
             */
            name: 'attachment_path',
            type: 'varchar',
            length: '18',
            isNullable: false,
            comment: 'domain을 제외한 path',
          }),
          clubPostColumn,
          generateCreatedAtColumn(),
        ],
        foreignKeys: [clubPostFk],
      }),
    );

    await queryRunner.query(
      'ALTER TABLE club_post_attachment COMMENT = "동아리 게시글 첨부 파일"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_attachment');
  }
}
