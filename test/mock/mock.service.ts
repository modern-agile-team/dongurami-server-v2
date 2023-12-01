import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { FreeBoardHistoryService } from '@src/apis/free-boards/free-board-history/services/free-board-history.service';
import { FreeBoardsService } from '@src/apis/free-boards/services/free-board.service';
import { UsersService } from '@src/apis/users/services/users.service';
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

export const mockFreeBoardsService: MockProvider<FreeBoardsService> = {
  create: jest.fn(),
  findAllAndCount: jest.fn(),
  putUpdate: jest.fn(),
};

export const mockFreeBoardHistoryService: MockProvider<FreeBoardHistoryService> =
  {
    create: jest.fn(),
  };
