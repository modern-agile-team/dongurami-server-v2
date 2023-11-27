import { transformPage } from '@src/common/common';

describe('common.ts unit test', () => {
  describe(transformPage.name, () => {
    let obj: { value: any };

    beforeEach(() => {
      obj = {} as any;
    });

    it('number 타입으로 변환되지 않는 문자열인 경우', () => {
      obj.value = 'str';

      expect(transformPage(obj)).toBeNaN();
    });

    it('number 타입으로 변환, 0보다 작은 경우', () => {
      obj.value = 0;

      expect(transformPage(obj)).toBe(-1);
    });

    it('number 타입으로 변환, 0보다 큰 경우', () => {
      obj.value = 1;

      expect(transformPage(obj)).toBe(0);
    });
  });
});
