import { MockProvider } from '@test/mock/mock.type';

import { QueryHelper } from '@src/helpers/query.helper';

export const mockQueryHelper: MockProvider<QueryHelper> = {
  buildWherePropForFind: jest.fn(),
};
