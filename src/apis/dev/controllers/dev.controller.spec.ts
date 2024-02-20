import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { mockAuthService } from '@test/mock/mock.service';

import { DevController } from '@src/apis/dev/controllers/dev.controller';

describe(DevController.name, () => {
  let controller: DevController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevController],
    }).compile();

    controller = module.get<DevController>(DevController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(DevController.prototype.getAccessToken.name, () => {
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
