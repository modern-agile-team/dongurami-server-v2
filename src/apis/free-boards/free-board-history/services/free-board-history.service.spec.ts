import { Test, TestingModule } from '@nestjs/testing';
import { FreeBoardHistoryService } from './free-board-history.service';

describe('FreeBoardHistoryService', () => {
  let service: FreeBoardHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreeBoardHistoryService],
    }).compile();

    service = module.get<FreeBoardHistoryService>(FreeBoardHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
