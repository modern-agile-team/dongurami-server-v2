import { MockProvider } from '@test/mock/mock.type';

import { FreePostCommentHistoryRepository } from '@src/apis/free-post-comments/free-post-comment-history/repositories/free-post-comment-history.repository';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UserHistoryRepository } from '@src/apis/users/user-history/repositories/user-history.repository';

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

export const mockUserHistoryRepository: MockProvider<UserHistoryRepository> = {
  ...getDefaultRepositoryMethod(),
};

export const mockFreePostRepository: MockProvider<FreePostRepository> = {
  ...getDefaultRepositoryMethod(),
};

export const mockFreePostCommentRepository: MockProvider<FreePostReplyCommentRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockFreePostReplyCommentRepository: MockProvider<FreePostReplyCommentRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockFreePostHistoryRepository: MockProvider<FreePostHistoryRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockFreePostCommentHistoryRepository: MockProvider<FreePostCommentHistoryRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockFreePostReplyCommentHistoryRepository: MockProvider<FreePostReplyCommentHistoryRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };

export const mockReactionTypeRepository: MockProvider<ReactionTypeRepository> =
  {
    ...getDefaultRepositoryMethod(),
  };
