import { Test, TestingModule } from '@nestjs/testing';
import { RootService } from '@src/apis/root/services/root.service';
import { RootController } from './root.controller';

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
