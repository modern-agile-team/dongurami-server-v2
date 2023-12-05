import { UserStatus } from '@src/apis/users/constants/user.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserSoftDelete1701675711005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
        comment: '삭제 일자',
      }),
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: [UserStatus.Active, UserStatus.Inactive],
        isNullable: false,
        default: `"${UserStatus.Active}"`,
        comment: '유저 상태',
      }),
    ]);

    queryRunner.query('ALTER TABLE user ALTER COLUMN status DROP DEFAULT');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', [
      new TableColumn({ name: 'deleted_at', type: 'timestamp' }),
      new TableColumn({ name: 'status', type: 'enum' }),
    ]);
  }
}
