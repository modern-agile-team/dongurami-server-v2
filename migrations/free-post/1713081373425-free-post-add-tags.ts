import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class FreePostAddTags1713081373425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'free_post',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '자유게시글 태그',
      }),
    );
    await queryRunner.addColumn(
      'free_post_history',
      new TableColumn({
        name: 'tags',
        type: 'json',
        isNullable: false,
        comment: '자유게시글 태그',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('free_post', 'tags');
    await queryRunner.dropColumn('free_post_history', 'tags');
  }
}
