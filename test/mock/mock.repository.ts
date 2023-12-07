import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { FreePost } from '@src/entities/FreePost';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { UserHistory } from '@src/entities/UserHistory';
import { MockProvider } from '@test/mock/mock.type';
import { Repository } from 'typeorm';

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

export const mockDataSource = {
  createQueryRunner: () => {
    return {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        withRepository: (repository) => {
          return repository;
        },
        create: jest.fn(),
      },
    };
  },
};

export const mockEntityManager = {
  withRepository: (repository) => {
    return repository;
  },
};

export const mockMajorRepository: MockProvider<MajorRepository> = {
  ...getDefaultRepositoryMethod(),
};

export const mockUserRepository: MockProvider<UserRepository> = {
  ...getDefaultRepositoryMethod(),
};

export const mockUserHistoryRepository: MockProvider<Repository<UserHistory>> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockFreePostRepository: MockProvider<Repository<FreePost>> = {
  ...getDefaultRepositoryMethod(),
};

export const mockFreePostHistoryRepository: MockProvider<
  Repository<FreePostHistory>
> = {
  ...getDefaultRepositoryMethod(),
};
