import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Payload } from '@src/apis/auth/type/auth.type';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { mockAppConfigService, mockJwtService } from '@test/mock/mock.service';
import { AuthService } from './auth.service';

describe(AuthService.name, () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
