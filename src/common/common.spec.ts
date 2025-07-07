import { isObject } from 'class-validator';

import { isNil, transformPage } from '@src/common/common';

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

  describe(isNil.name, () => {
    it('undefined', () => {
      expect(isNil(undefined)).toBe(true);
    });

    it('null', () => {
      expect(isNil(null)).toBe(true);
    });

    it('string', () => {
      expect(isNil('')).toBe(false);
    });
  });

  describe(isObject.name, () => {
    it('undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('string', () => {
      expect(isObject('str')).toBe(false);
    });

    it('array', () => {
      expect(isObject([])).toBe(false);
    });

    it('class object', () => {
      class Test {}

      const test = new Test();

      expect(isObject(test)).toBe(true);
    });

    it('plain object', () => {
      expect(isObject({})).toBe(true);
    });
  });
});
