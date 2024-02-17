import { Test, TestingModule } from '@nestjs/testing';

import { RootController } from '@src/apis/root/controllers/root.controller';
import { RootService } from '@src/apis/root/services/root.service';

describe(RootController.name, () => {
  let controller: RootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
      providers: [RootService],
    }).compile();

    controller = module.get<RootController>(RootController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
