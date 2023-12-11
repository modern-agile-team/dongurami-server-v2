import { Test, TestingModule } from '@nestjs/testing';
import { FreePostCommentsController } from './free-post-comments.controller';

describe('FreePostCommentsController', () => {
  let controller: FreePostCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreePostCommentsController],
    }).compile();

    controller = module.get<FreePostCommentsController>(FreePostCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
