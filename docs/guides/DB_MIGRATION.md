# DB Migration

**typeorm migration 기능을 이용하여 migration**

[typeorm migration doc](https://orkhan.gitbook.io/typeorm/docs/migrations)

[typeorm.config.ts](../../typeorm.config.ts)파일 설정을 따라간다.

### Migration file 생성

npx typeorm migration:create ./migrations/{file_name}

#### Example

```bash
$ npx typeorm migration:create ./migrations/migration-example
```

- 마이그레이션 파일이 생성됨 생성

file: ./migrations/1706424509757-migration-example.ts

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationExample1706424509757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
```

### Migration 이력 조회

migrations 디렉토리에 있는 파일들의 migration 여부를 확인

```bash
$ npm run db:migrate:show
```

<img width="360" alt="image" src="https://github.com/modern-agile-team/dongurami-server-v2/assets/46591459/f515fdbf-ff20-4221-a98b-8dba7a838885">

### Migration 실행

- 실행되지 않은 모든 마이그레이션 파일을 실행
  - 파일 내의 `up` method 실행
  - 위 사진에서 체크되지 않은 목록

```bash
$ npm run db:migrate
```

### Migration revert 실행

- migration 된 파일 중 가장 최신 마이그레이션을 revert함
  - 파일 내의 `down` method 실행

```bash
$ npm run db:migrate:revert
```
