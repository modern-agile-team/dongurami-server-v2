import { Test, TestingModule } from '@nestjs/testing';
import { FreeBoardsService } from './free-board.service';

describe('FreeBoardService', () => {
  let service: FreeBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeBoardsService],
    }).compile();

    service = module.get<FreeBoardsService>(FreeBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
