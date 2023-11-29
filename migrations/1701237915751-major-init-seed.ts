import { Major } from '@src/entities/Major';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MajorInitSeed1701237915751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const entityManager = queryRunner.manager;

    const majorRepository = entityManager.getRepository(Major);

    await majorRepository.delete({});

    await majorRepository.upsert(
      [
        { code: '00', name: '학과 선택', memo: '학과 선택' },
        {
          code: '01',
          name: '디지털산업디자인학과',
          memo: '디지털산업디자인학과',
        },
        {
          code: '02',
          name: '시각디자인과',
          memo: '시각디자인과',
        },
        {
          code: '03',
          name: '건축학과',
          memo: '건축학과',
        },
        {
          code: '04',
          name: '주얼리디자인학과',
          memo: '주얼리디자인학과',
        },
        {
          code: '05',
          name: '기계설계학과',
          memo: '기계설계학과',
        },
        {
          code: '06',
          name: '멀티미디어디자인학과',
          memo: '멀티미디어디자인학과',
        },
        {
          code: '07',
          name: '기계자동차학과',
          memo: '기계자동차학과',
        },
        {
          code: '08',
          name: '컴퓨터전자공학과',
          memo: '컴퓨터전자공학과',
        },
        {
          code: '09',
          name: '토목공학과',
          memo: '토목공학과',
        },
        {
          code: '10',
          name: '산업경영공학과',
          memo: '산업경영공학과',
        },
        {
          code: '11',
          name: '비즈니스영어과',
          memo: '비즈니스영어과',
        },
        {
          code: '12',
          name: '컴퓨터소프트웨어학과',
          memo: '컴퓨터소프트웨어학과',
        },
        {
          code: '13',
          name: '실내건축과',
          memo: '실내건축과',
        },
        {
          code: '14',
          name: '방송영상미디어학과',
          memo: '방송영상미디어학과',
        },
        {
          code: '15',
          name: '메카트로닉스공학과',
          memo: '메카트로닉스공학과',
        },
        {
          code: '16',
          name: '정보통신공학과',
          memo: '정보통신공학과',
        },
        {
          code: '17',
          name: '비서학과',
          memo: '비서학과',
        },
        {
          code: '18',
          name: '건설안전공학과',
          memo: '건설안전공학과',
        },
        {
          code: '19',
          name: '리빙세라믹디자인학과',
          memo: '리빙세라믹디자인학과',
        },
        {
          code: '20',
          name: '웹툰만화창작학과',
          memo: '웹툰만화창작학과',
        },
        {
          code: '21',
          name: '방송연예과',
          memo: '방송연예과',
        },
        {
          code: '22',
          name: '관광서비스경영학과',
          memo: '관광서비스경영학과',
        },
        {
          code: '23',
          name: '중국어과',
          memo: '중국어과',
        },
        {
          code: '25',
          name: '도시디자인학과',
          memo: '도시디자인학과',
        },
        {
          code: '26',
          name: '비즈니스일본어과',
          memo: '비즈니스일본어과',
        },
        {
          code: '27',
          name: '사회복지학과',
          memo: '사회복지학과',
        },
        {
          code: '28',
          name: '세무회계학과',
          memo: '세무회계학과',
        },
        {
          code: '29',
          name: '방송연예과(방송연기전공)',
          memo: '방송연예과(방송연기전공)',
        },
        {
          code: '30',
          name: '방송연예과(방송분장전공)',
          memo: '방송연예과(방송분장전공)',
        },
        {
          code: '31',
          name: '중국어과(cs-중국어서비스전공)',
          memo: '중국어과(cs-중국어서비스전공)',
        },
        {
          code: '32',
          name: '중국어과(비즈니스)',
          memo: '중국어과(비즈니스)',
        },
        {
          code: '33',
          name: '사회복지과(사회복지전공)',
          memo: '사회복지과(사회복지전공)',
        },
        {
          code: '34',
          name: '사회복지과(아동보육전공)',
          memo: '사회복지과(아동보육전공)',
        },
        {
          code: '35',
          name: '융합기계공학과',
          memo: '융합기계공학과',
        },
        {
          code: '36',
          name: '게임&VR디자인학과',
          memo: '게임&VR디자인학과',
        },
        {
          code: '37',
          name: '방송뷰티메이크업과',
          memo: '방송뷰티메이크업과',
        },
        {
          code: '38',
          name: '방송연예과(뮤지컬전공)',
          memo: '방송연예과(뮤지컬전공)',
        },
        {
          code: '39',
          name: '방송연예과(K-POP전공)',
          memo: '방송연예과(K-POP전공)',
        },
        {
          code: '40',
          name: '방송뷰티학과(메이크업헤어전공)',
          memo: '방송뷰티학과(메이크업헤어전공)',
        },
        {
          code: '41',
          name: '방송뷰티학과(스타일리스트전공)',
          memo: '방송뷰티학과(스타일리스트전공)',
        },
        {
          code: '42',
          name: '글로벌항공서비스학과',
          memo: '글로벌항공서비스학과',
        },
        {
          code: '43',
          name: '휴먼사회복지학과',
          memo: '휴먼사회복지학과',
        },
        {
          code: '44',
          name: '방송연예과(연기전공)',
          memo: '방송연예과(연기전공)',
        },
        {
          code: '45',
          name: '방송연예과',
          memo: '방송연예과',
        },
        {
          code: '62',
          name: '친환경자율주행자동차학과',
          memo: '친환경자율주행자동차학과',
        },
        {
          code: '63',
          name: '3D모델리버스엔지니어학과',
          memo: '3D모델리버스엔지니어학과',
        },
      ],
      ['name'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const entityManager = queryRunner.manager;

    const majorRepository = entityManager.getRepository(Major);

    await majorRepository.delete({});
  }
}
