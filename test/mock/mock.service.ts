import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { FreePostCommentsService } from '@src/apis/free-post-comments/services/free-post-comments.service';
import { FreePostReplyCommentHistoryService } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/services/free-post-reply-comment-history.service';
import { FreePostReplyCommentsService } from '@src/apis/free-post-reply-comments/services/free-post-reply-comments.service';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { UsersService } from '@src/apis/users/services/users.service';
import { UserHistoryService } from '@src/apis/users/user-history/services/user-history.service';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import { MockProvider } from '@test/mock/mock.type';

export const mockEncryptionService: MockProvider<EncryptionService> = {
  compare: jest.fn(),
  hash: jest.fn(),
};

export const mockJwtService: MockProvider<JwtService> = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
  verifyAsync: jest.fn(),
  decode: jest.fn(),
};

export const mockAppConfigService: MockProvider<AppConfigService> = {
  get: jest.fn(),
  getList: jest.fn(),
  getAll: jest.fn(),
  getAllMap: jest.fn(),
  isLocal: jest.fn(),
  isDevelopment: jest.fn(),
  isProduction: jest.fn(),
};

export const mockAuthService: MockProvider<AuthService> = {
  generateToken: jest.fn(),
  signIn: jest.fn(),
};

export const mockUsersService: MockProvider<UsersService> = {
  create: jest.fn(),
  findOneById: jest.fn(),
  findOneBy: jest.fn(),
};

export const mockUserHistoryService: MockProvider<UserHistoryService> = {
  create: jest.fn(),
};

export const mockCommonPostsService: MockProvider<CommonPostsService<any>> = {
  incrementHit: jest.fn(),
};

export const mockFreePostsService: MockProvider<FreePostsService> = {
  create: jest.fn(),
  findAllAndCount: jest.fn(),
  patchUpdate: jest.fn(),
  findOneOrNotFound: jest.fn(),
  putUpdate: jest.fn(),
  remove: jest.fn(),
  incrementHit: jest.fn(),
};

export const mockFreePostHistoryService: MockProvider<FreePostHistoryService> =
  {
    create: jest.fn(),
    findOneOrFail: jest.fn(),
  };

export const mockFreePostCommentsService: MockProvider<FreePostCommentsService> =
  {
    create: jest.fn(),
    findAllAndCount: jest.fn(),
    findOneOrNotFound: jest.fn(),
    putUpdate: jest.fn(),
    remove: jest.fn(),
  };

export const mockFreePostCommentHistoryService: MockProvider<FreePostCommentHistoryService> =
  {
    create: jest.fn(),
    findOneOrFail: jest.fn(),
  };

export const mockFreePostReplyCommentsService: MockProvider<FreePostReplyCommentsService> =
  {
    create: jest.fn(),
    findAllAndCount: jest.fn(),
    findOneOrNotFound: jest.fn(),
    putUpdate: jest.fn(),
    remove: jest.fn(),
  };

export const mockFreePostReplyCommentHistoryService: MockProvider<FreePostReplyCommentHistoryService> =
  {
    create: jest.fn(),
  };
