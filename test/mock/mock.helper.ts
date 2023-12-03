import { QueryHelper } from '@src/helpers/query.helper';
import { MockProvider } from '@test/mock/mock.type';

export const mockQueryHelper: MockProvider<QueryHelper> = {
  buildWherePropForFind: jest.fn(),
};
