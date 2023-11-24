import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { MockProvider } from '@test/mock/mock.type';

const getDefaultRepositoryMethod = () => {
  return {
    target: jest.fn(),
    manager: jest.fn(),
    metadata: jest.fn(),
    createQueryBuilder: jest.fn(),
    hasId: jest.fn(),
    getId: jest.fn(),
    create: jest.fn(),
    merge: jest.fn(),
    preload: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    softRemove: jest.fn(),
    recover: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),
    exist: jest.fn(),
    count: jest.fn(),
    countBy: jest.fn(),
    sum: jest.fn(),
    average: jest.fn(),
    minimum: jest.fn(),
    maximum: jest.fn(),
    find: jest.fn(),
    findBy: jest.fn(),
    findAndCount: jest.fn(),
    findAndCountBy: jest.fn(),
    findByIds: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findOneById: jest.fn(),
    findOneOrFail: jest.fn(),
    findOneByOrFail: jest.fn(),
    query: jest.fn(),
    clear: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
    extend: jest.fn(),
  };
};

export const mockUserRepository: MockProvider<UserRepository> = {
  ...getDefaultRepositoryMethod(),
};