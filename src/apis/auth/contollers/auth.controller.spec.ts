import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockAuthService } from '@test/mock/mock.service';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

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
