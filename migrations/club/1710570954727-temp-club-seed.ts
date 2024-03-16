import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Club } from '@src/entities/Club';
import { ClubCategory } from '@src/entities/ClubCategory';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubTag } from '@src/entities/ClubTag';
import { ClubTagLink } from '@src/entities/ClubTagLink';
import { User } from '@src/entities/User';

/**
 * 해당 마이그레이션은 개발 편의성을 위한 마이그레이션임
 * 릴리즈 전 club, club_category, club_tag, club_category_link, club_tag_link 테이블을 비워야함
 */
export class TempClubSeed1710570954727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);
    const tempUser = await userRepository.save(
      userRepository.create({ loginType: 'KAKAO' as any }),
    );

    const clubRepository = queryRunner.manager.getRepository(Club);
    const clubTagRepository = queryRunner.manager.getRepository(ClubTag);
    const clubTagLinkRepository =
      queryRunner.manager.getRepository(ClubTagLink);
    const clubCategoryRepository =
      queryRunner.manager.getRepository(ClubCategory);
    const clubCategoryLinkRepository =
      queryRunner.manager.getRepository(ClubCategoryLink);

    const clubs = await clubRepository.save(
      Array.from({ length: 50 }).map(() => {
        return clubRepository.create({
          userId: tempUser.id,
          name: faker.company.name(),
          introduce: faker.word.words(),
        });
      }),
    );

    const clubTags = await clubTagRepository.save(
      Array.from({ length: 50 }).map(() => {
        return clubTagRepository.create({
          userId: tempUser.id,
          name: faker.word.noun(),
        });
      }),
    );

    const clubCategories = await clubCategoryRepository.save(
      Array.from({ length: 50 }).map(() => {
        return clubCategoryRepository.create({
          userId: tempUser.id,
          name: faker.word.noun(),
          memo: 'mock data',
        });
      }),
    );

    for (let i = 0; i < clubs.length; i += 1) {
      const clubId = clubs[i].id;

      const clubTagIds = faker.helpers.arrayElements(
        clubTags.map((el) => el.id),
        { min: 0, max: 50 },
      );
      const clubCategoryIds = faker.helpers.arrayElements(
        clubCategories.map((el) => el.id),
        { min: 0, max: 50 },
      );

      await clubTagLinkRepository.save(
        clubTagIds.map((clubTagId) => {
          return clubTagLinkRepository.create({
            clubTagId,
            userId: tempUser.id,
            clubId: clubId,
          });
        }),
      );
      await clubCategoryLinkRepository.save(
        clubCategoryIds.map((clubCategoryId) => {
          return clubCategoryLinkRepository.create({
            clubCategoryId,
            userId: tempUser.id,
            clubId: clubId,
          });
        }),
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
