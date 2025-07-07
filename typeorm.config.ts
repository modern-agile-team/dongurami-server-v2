import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// process.env 파일을 먼저 읽고, root directory 에 .env.local 파일이 있을 경우, override 함
config({ path: '.env' });
config({ path: '.env.local', override: true });

export default new DataSource({
  type: 'mysql',
  host: process.env.RDB_HOST,
  port: +process.env.RDB_PORT,
  username: process.env.RDB_USER_NAME,
  password: process.env.RDB_PASSWORD,
  database: process.env.RDB_DATABASE,
  /** @todo 추후 entity 경로에 따라 수정 */
  entities: ['./src/entities/*.ts'],
  migrationsTableName: 'migrations', // migration 이력을 저장하는 테이블
  migrations: ['migrations/**/[0-9]*.ts'], // migration 할 파일들이 있는 directory
  timezone: '+00:00',
});
