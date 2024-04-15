import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class NoticePostAddTags1713082909950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notice_post',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '공지게시글 태그',
      }),
    );
    await queryRunner.addColumn(
      'notice_post_history',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '공지게시글 태그',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notice_post', 'tags');
    await queryRunner.dropColumn('notice_post_history', 'tags');
  }
}
