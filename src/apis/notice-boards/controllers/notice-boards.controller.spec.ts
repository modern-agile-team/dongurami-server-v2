import { Test, TestingModule } from '@nestjs/testing';
import { NoticeBoardsController } from './notice-boards.controller';

describe('NoticeBoardsController', () => {
  let controller: NoticeBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeBoardsController],
    }).compile();

    controller = module.get<NoticeBoardsController>(NoticeBoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
