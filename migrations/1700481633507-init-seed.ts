import { MigrationInterface, QueryRunner } from 'typeorm';
import { ClubCategory } from '../src/entities/ClubCategory';
import { Major } from '../src/entities/Major';
import { ReactionType } from '../src/entities/ReactionType';

export class InitSeed1700481633507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const entityManager = queryRunner.manager;

    const clubCategoryRepository = entityManager.getRepository(ClubCategory);
    const majorRepository = entityManager.getRepository(Major);
    const reactionTypeRepository = entityManager.getRepository(ReactionType);

    /**
     * @todo 정해지면 수정
     */
    await clubCategoryRepository.upsert(
      [
        {
          name: 'category 1',
          memo: 'category 1',
        },
        {
          name: 'category 2',
          memo: 'category 2',
        },
        {
          name: 'category 3',
          memo: 'category 3',
        },
        {
          name: 'category 4',
          memo: 'category 4',
        },
        {
          name: 'category 5',
          memo: 'category 5',
        },
        {
          name: 'category 6',
          memo: 'category 6',
        },
      ],
      ['name'],
    );

    /**
     * @todo 정해지면 수정
     */
    await majorRepository.upsert(
      [
        {
          code: '01',
          name: 'major 1',
          memo: 'major 1',
        },
        {
          code: '02',
          name: 'major 2',
          memo: 'major 2',
        },
        {
          code: '03',
          name: 'major 3',
          memo: 'major 3',
        },
        {
          code: '04',
          name: 'major 4',
          memo: 'major 4',
        },
        {
          code: '05',
          name: 'major 5',
          memo: 'major 5',
        },
        {
          code: '06',
          name: 'major 6',
          memo: 'major 6',
        },
        {
          code: '07',
          name: 'major 7',
          memo: 'major 7',
        },
      ],
      ['name'],
    );

    /**
     * @todo 정해지면 수정
     */
    await reactionTypeRepository.upsert(
      [
        {
          name: 'like',
          memo: '좋아요',
        },
      ],
      ['name'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const entityManager = queryRunner.manager;

    const clubCategoryRepository = entityManager.getRepository(ClubCategory);
    const majorRepository = entityManager.getRepository(Major);
    const reactionTypeRepository = entityManager.getRepository(ReactionType);

    await clubCategoryRepository.delete({});
    await majorRepository.delete({});
    await reactionTypeRepository.delete({});
  }
}
