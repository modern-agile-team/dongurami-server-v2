import { Test, TestingModule } from '@nestjs/testing';
import { FreeBoardsService } from '../services/free-board.service';
import { FreeBoardsController } from './free-boards.controller';

describe('FreeBoardController', () => {
  let controller: FreeBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeBoardsController],
      providers: [FreeBoardsService],
    }).compile();

    controller = module.get<FreeBoardsController>(FreeBoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
