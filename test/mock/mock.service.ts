import { UsersService } from '@src/apis/users/services/users.service';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import { MockProvider } from '@test/mock/mock.type';

export const mockEncryptionService: MockProvider<EncryptionService> = {
  hash: jest.fn(),
};

export const mockUsersService: MockProvider<UsersService> = {
  create: jest.fn(),
};
