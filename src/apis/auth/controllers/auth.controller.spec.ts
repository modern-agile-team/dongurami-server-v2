import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { mockAuthService } from '@test/mock/mock.service';

import { AuthController } from '@src/apis/auth/controllers/auth.controller';
import { SignInRequestBodyDto } from '@src/apis/auth/dto/sign-in-request-body.dto';
import { AuthService } from '@src/apis/auth/services/auth.service';
import { UserDto } from '@src/apis/users/dto/user.dto';

describe(AuthController.name, () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(AuthController.prototype.signIn.name, () => {
    let signInRequestBodyDto: SignInRequestBodyDto;

    beforeEach(() => {
      signInRequestBodyDto = new SignInRequestBodyDto();
    });

    it('sign in', async () => {
      const token = 'token';

      mockAuthService.signIn.mockResolvedValue({ token });

      await expect(controller.signIn(signInRequestBodyDto)).resolves.toEqual({
        token,
      });
    });
  });

  describe(AuthController.prototype.getProfile.name, () => {
    let user: UserDto;

    beforeEach(() => {
      user = new UserDto();
    });

    it('getProfile', () => {
      expect(controller.getProfile(user)).toBeInstanceOf(UserDto);
    });
  });

  describe(AuthController.prototype.getAccessToken.name, () => {
    let userId: number;

    beforeEach(() => {
      userId = faker.number.int();
    });

    it('getAccessToken', () => {
      const token = 'token';

      mockAuthService.generateToken.mockReturnValue(token);

      expect(controller.getAccessToken(userId)).toBe(token);
    });
  });
});
