import { Test, TestingModule } from '@nestjs/testing';
import { FreeBoardService } from '../free-board.service';
import { FreeBoardController } from './free-board.controller';

describe('FreeBoardController', () => {
  let controller: FreeBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeBoardController],
      providers: [FreeBoardService],
    }).compile();

    controller = module.get<FreeBoardController>(FreeBoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
