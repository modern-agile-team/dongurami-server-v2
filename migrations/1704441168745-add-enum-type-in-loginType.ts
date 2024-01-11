import { MigrationInterface, QueryRunner } from "typeorm"

export class Migrations1704441168745 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user MODIFY COLUMN login_type ENUM('email', 'KAKAO', 'GOOGLE', 'NAVER') NOT NULL DEFAULT 'email';
    `);
    await queryRunner.query(`
      ALTER TABLE user_history MODIFY COLUMN login_type ENUM('email', 'KAKAO', 'GOOGLE', 'NAVER') NOT NULL DEFAULT 'email';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE user MODIFY COLUMN login_type ENUM('email') NOT NULL DEFAULT 'email';
    `);
    await queryRunner.query(`
      ALTER TABLE user_history MODIFY COLUMN login_type ENUM('email') NOT NULL DEFAULT 'email';
    `);
  }
}
