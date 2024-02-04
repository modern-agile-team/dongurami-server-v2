import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class UserEmailNullable1706878330599 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
        comment: '이메일'
      })
    );

    await queryRunner.changeColumn(
      'user_history',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
        comment: '이메일'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
        comment: '이메일'
      })
    );

    await queryRunner.changeColumn(
      'user_history',
      'email',
      new TableColumn({
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true,
        comment: '이메일'
      })
    );
  }
}
