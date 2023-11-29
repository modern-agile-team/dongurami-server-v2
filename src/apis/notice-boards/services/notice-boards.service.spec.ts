import { Test, TestingModule } from '@nestjs/testing';
import { NoticeBoardsService } from './notice-boards.service';

describe('NoticeBoardsService', () => {
  let service: NoticeBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeBoardsService],
    }).compile();

    service = module.get<NoticeBoardsService>(NoticeBoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
