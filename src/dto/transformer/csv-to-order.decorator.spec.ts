import { plainToInstance } from 'class-transformer';

import { SortOrder } from '@src/constants/enum';
import { CsvToOrder } from '@src/dto/transformer/csv-to-order.decorator';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';

describe(CsvToOrder.name, () => {
  const allowFields: string[] = ['id', 'createdAt'];

  class Test {
    @CsvToOrder(allowFields)
    orderBy: unknown;
  }

  it('string 타입이 들어오지 않은 경우', () => {
    expect(() => {
      plainToInstance(Test, { orderBy: 1 });
    }).toThrow(HttpInternalServerErrorException);
  });

  it('empty string 이 들어온경우 기본값 안줌', () => {
    const test = plainToInstance(Test, { orderBy: '' });

    expect(test.orderBy).toStrictEqual({ id: SortOrder.Desc });
  });

  it('허용하지 않은 필드만 들어온 경우 기본값 줌', () => {
    class Test {
      @CsvToOrder(allowFields, { createdAt: SortOrder.Asc })
      orderBy: unknown;
    }
    const test = plainToInstance(Test, { orderBy: 'deletedAt,updatedAt' });

    expect(test.orderBy).toStrictEqual({ createdAt: SortOrder.Asc });
  });

  it('필드 내 공백이 있으면 공백 제거', () => {
    class Test {
      @CsvToOrder(allowFields, { createdAt: SortOrder.Asc })
      orderBy: unknown;
    }

    const test = plainToInstance(Test, { orderBy: 'id, createdAt' });

    expect(test.orderBy).toStrictEqual({
      id: SortOrder.Desc,
      createdAt: SortOrder.Desc,
    });
  });

  it('모두 오름차순', () => {
    const test = plainToInstance(Test, { orderBy: 'id,createdAt' });

    expect(test.orderBy).toStrictEqual({
      id: SortOrder.Desc,
      createdAt: SortOrder.Desc,
    });
  });

  it('모두 내림차순', () => {
    const test = plainToInstance(Test, { orderBy: '-id,-createdAt' });

    expect(test.orderBy).toStrictEqual({
      id: SortOrder.Asc,
      createdAt: SortOrder.Asc,
    });
  });

  it('오름차순 내림차순 조합', () => {
    const test = plainToInstance(Test, { orderBy: '-id,createdAt' });

    expect(test.orderBy).toStrictEqual({
      id: SortOrder.Asc,
      createdAt: SortOrder.Desc,
    });
  });

  it('허용하지 않은 필드가 들어온 경우', () => {
    const test = plainToInstance(Test, { orderBy: 'id,deletedAt' });

    expect(test.orderBy).toStrictEqual({
      id: SortOrder.Desc,
    });
  });
});
