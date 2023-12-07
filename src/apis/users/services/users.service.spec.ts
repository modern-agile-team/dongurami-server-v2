import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UsersService } from '@src/apis/users/services/users.service';
import { UserHistoryService } from '@src/apis/users/user-history/services/user-history.service';
import { User } from '@src/entities/User';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import {
  mockDataSource,
  mockMajorRepository,
  mockUserRepository,
} from '@test/mock/mock.repository';
import {
  mockEncryptionService,
  mockUserHistoryService,
} from '@test/mock/mock.service';
import { DataSource } from 'typeorm';

describe(UsersService.name, () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserHistoryService,
          useValue: mockUserHistoryService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: MajorRepository,
          useValue: mockMajorRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(UsersService.prototype.create.name, () => {
    let createUserRequestBodyDto: CreateUserRequestBodyDto;

    let existUser: User;

    let newUser: User;

    beforeEach(() => {
      createUserRequestBodyDto = new CreateUserRequestBodyDto();

      existUser = new User();

      newUser = new User();
    });

    it('동일한 이메일이 있는 경우', async () => {
      const sameEmail = 'same@email.com';
      createUserRequestBodyDto.email = sameEmail;
      existUser.email = sameEmail;

      mockUserRepository.findOne.mockResolvedValue(existUser);

      await expect(service.create(createUserRequestBodyDto)).rejects.toThrow(
        HttpConflictException,
      );
    });

    it('동일한 핸드폰 번호가 있는 경우', async () => {
      const samePhoneNumber = '010-1234-1234';
      createUserRequestBodyDto.phoneNumber = samePhoneNumber;
      existUser.phoneNumber = samePhoneNumber;

      mockUserRepository.findOne.mockResolvedValue(createUserRequestBodyDto);

      await expect(service.create(createUserRequestBodyDto)).rejects.toThrow(
        HttpConflictException,
      );
    });

    it('새로운 유저 생성', async () => {
      const originPassword = 'password';
      const hashedPassword = 'hashedPassword';

      createUserRequestBodyDto.name = 'new user';
      createUserRequestBodyDto.password = originPassword;

      newUser.id = faker.number.int();
      newUser.name = createUserRequestBodyDto.name;
      newUser.password = originPassword;

      mockMajorRepository.findOne.mockResolvedValue({ id: 1 });
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(createUserRequestBodyDto);
      mockEncryptionService.hash.mockResolvedValue(hashedPassword);

      await expect(
        service.create(createUserRequestBodyDto),
      ).resolves.toBeInstanceOf(UserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword,
        }),
      );
    });
  });

  describe(UsersService.prototype.findOneById.name, () => {
    let id: number;

    let user: User;

    beforeEach(() => {
      id: NaN;

      user = new User();
    });

    it('유저가 없는 경우', async () => {
      id = faker.number.int();

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneById(id)).resolves.toBeNull();
    });

    it('유저가 있는 경우', async () => {
      id = faker.number.int();

      mockUserRepository.findOneBy.mockResolvedValue(user);

      await expect(service.findOneById(id)).resolves.toBeInstanceOf(UserDto);
    });
  });

  describe(UsersService.prototype.findOneBy.name, () => {
    let id: number;

    let user: User;

    beforeEach(() => {
      id: NaN;

      user = new User();
    });

    it('유저가 없는 경우', async () => {
      id = faker.number.int();

      const where = { id };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneBy(where)).resolves.toBeNull();

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith(where);
    });

    it('유저가 있는 경우', async () => {
      id = faker.number.int();

      const where = { id };

      mockUserRepository.findOneBy.mockResolvedValue(user);

      await expect(service.findOneBy(where)).resolves.toBeInstanceOf(UserDto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith(where);
    });
  });
});
