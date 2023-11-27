import { Test, TestingModule } from '@nestjs/testing';
import { ClubBoardController } from './club-board.controller';

describe('ClubBoardController', () => {
  let controller: ClubBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubBoardController],
    }).compile();

    controller = module.get<ClubBoardController>(ClubBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
