import { faker } from '@faker-js/faker';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRequestBodyDto } from '@src/apis/users/dto/create-user-request-body.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UsersService } from '@src/apis/users/services/users.service';
import { User } from '@src/entities/User';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import { mockUserRepository } from '@test/mock/mock.repository';
import { mockEncryptionService } from '@test/mock/mock.service';

describe(UsersService.name, () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
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
        ConflictException,
      );
    });

    it('동일한 핸드폰 번호가 있는 경우', async () => {
      const samePhoneNumber = '010-1234-1234';
      createUserRequestBodyDto.phoneNumber = samePhoneNumber;
      existUser.phoneNumber = samePhoneNumber;

      mockUserRepository.findOne.mockResolvedValue(createUserRequestBodyDto);

      await expect(service.create(createUserRequestBodyDto)).rejects.toThrow(
        ConflictException,
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
});
