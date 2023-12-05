import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserStudentNumber1701771662843 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'student_number',
        type: 'varchar',
        length: '20',
        isNullable: true,
        comment: '유저 학번',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'student_number');
  }
}
