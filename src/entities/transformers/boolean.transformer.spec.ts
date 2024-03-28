import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

describe(BooleanTransformer.name, () => {
  // from의 경우에는 default값이 관련 없다고 판단 되어 constructor에 true를 넣은 test suite만 생성
  describe(BooleanTransformer.prototype.from, () => {
    describe('defaultValue값이 true일 때', () => {
      let defaultBooleanTransformer: BooleanTransformer;

      beforeAll(() => {
        defaultBooleanTransformer = new BooleanTransformer(true);
      });

      it('value가 1일 때', () => {
        expect(defaultBooleanTransformer.from(1)).toBe(true);
      });

      it('value가 0일 때', () => {
        expect(defaultBooleanTransformer.from(0)).toBe(false);
      });

      it('value가 null일 때', () => {
        expect(defaultBooleanTransformer.from(null)).toBe(null);
      });
    });
  });

  describe(BooleanTransformer.prototype.to, () => {
    describe('defaultValue값이 true일 때', () => {
      let defaultBooleanTransformer: BooleanTransformer;

      beforeAll(() => {
        defaultBooleanTransformer = new BooleanTransformer(true);
      });

      it('value가 true일 때', () => {
        expect(defaultBooleanTransformer.to(true)).toBe(1);
      });

      it('value가 false일 때', () => {
        expect(defaultBooleanTransformer.to(false)).toBe(0);
      });

      it('value가 undefined일 때', () => {
        expect(defaultBooleanTransformer.to(undefined)).toBe(1);
      });
    });
  });

  describe(BooleanTransformer.prototype.to, () => {
    describe('defaultValue값이 false일 때', () => {
      let defaultBooleanTransformer: BooleanTransformer;

      beforeAll(() => {
        defaultBooleanTransformer = new BooleanTransformer(false);
      });

      it('value가 true일 때', () => {
        expect(defaultBooleanTransformer.to(true)).toBe(1);
      });

      it('value가 false일 때', () => {
        expect(defaultBooleanTransformer.to(false)).toBe(0);
      });

      it('value가 undefined일 때', () => {
        expect(defaultBooleanTransformer.to(undefined)).toBe(0);
      });
    });
  });
});
