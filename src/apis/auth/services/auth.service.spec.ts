import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { Payload } from '@src/apis/auth/type/auth.type';
import { UserLoginType } from '@src/apis/users/constants/user.enum';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { UsersService } from '@src/apis/users/services/users.service';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';
import {
  mockAppConfigService,
  mockEncryptionService,
  mockJwtService,
  mockUsersService,
} from '@test/mock/mock.service';
import { AuthService } from './auth.service';

describe(AuthService.name, () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(AuthService.prototype.signIn.name, () => {
    let signInRequestBodyDto: SignInRequestBodyDto;

    let existUser: UserDto;

    beforeEach(() => {
      signInRequestBodyDto = new SignInRequestBodyDto();

      existUser = new UserDto();
    });

    it('not exist user', async () => {
      signInRequestBodyDto.loginType = UserLoginType.Email;
      signInRequestBodyDto.email = 'email@email.com';

      mockUsersService.findOneBy.mockResolvedValue(null);

      await expect(service.signIn(signInRequestBodyDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('password 가 없는 경우(현재 이메일만 있기에 서버에러로 처리)', async () => {
      signInRequestBodyDto.loginType = UserLoginType.Email;
      signInRequestBodyDto.email = 'email@email.com';

      existUser.email = signInRequestBodyDto.email;

      mockUsersService.findOneBy.mockResolvedValue(existUser);

      await expect(service.signIn(signInRequestBodyDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('password 가 틀린 경우', async () => {
      signInRequestBodyDto.loginType = UserLoginType.Email;
      signInRequestBodyDto.email = 'email@email.com';
      signInRequestBodyDto.password = 'password';

      existUser.email = signInRequestBodyDto.email;
      existUser.password = 'wrongPassword';

      mockUsersService.findOneBy.mockResolvedValue(existUser);
      mockEncryptionService.compare.mockResolvedValue(false);

      await expect(service.signIn(signInRequestBodyDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('sign in', async () => {
      signInRequestBodyDto.loginType = UserLoginType.Email;
      signInRequestBodyDto.email = 'email@email.com';
      signInRequestBodyDto.password = 'password';

      existUser.id = faker.number.int();
      existUser.email = signInRequestBodyDto.email;
      existUser.password = signInRequestBodyDto.password;

      mockUsersService.findOneBy.mockResolvedValue(existUser);
      mockEncryptionService.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('token');

      await expect(service.signIn(signInRequestBodyDto)).resolves.toEqual(
        expect.objectContaining({
          accessToken: expect.anything(),
        }),
      );
    });
  });

  describe(AuthService.prototype.generateToken.name, () => {
    let payload: Payload;

    beforeEach(() => {
      payload = {
        id: NaN,
      };
    });

    it('generateAccessToken', () => {
      const token = 'token';

      payload.id = faker.number.int();

      mockJwtService.sign.mockReturnValue(token);

      expect(service.generateToken(payload)).toBe(token);
    });
  });
});
