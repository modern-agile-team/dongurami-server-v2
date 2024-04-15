import {
  generateCreatedAtColumn,
  generateFkColumnAndOption,
  generatePrimaryColumn,
} from 'migrations/__utils/util';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ClubPostTagLink1713162804915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { column: userColumn, fk: userFk } = generateFkColumnAndOption(
      'user',
      '동아리 게시글 태그 링크 생성 유저 고유 ID',
    );

    const { column: clubPostColumn, fk: clubPostFk } =
      generateFkColumnAndOption('club_post', '동아리 게시글 고유 ID');

    const { column: clubPostTagColumn, fk: clubPostTagFk } =
      generateFkColumnAndOption('club_post_tag', '동아리 게시글 태그 고유 ID');

    await queryRunner.createTable(
      new Table({
        name: 'club_post_tag_link',
        columns: [
          generatePrimaryColumn('동아리 게시글 태그 링크 고유 ID'),
          userColumn,
          clubPostColumn,
          clubPostTagColumn,
          generateCreatedAtColumn(),
        ],
        foreignKeys: [userFk, clubPostFk, clubPostTagFk],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('club_post_tag_link');
  }
}
