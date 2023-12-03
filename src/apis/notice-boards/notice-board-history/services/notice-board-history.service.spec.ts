import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockEntityManager,
  mockNoticeBoardHistoryRepository,
} from '@test/mock/mock.repository';

import { NoticeBoardHistory } from '@src/entities/NoticeBoardHistory';
import { CreateNoticeBoardHistoryDto } from '../dto/create-notice-board-history.dto';
import { NoticeBoardHistoryService } from './notice-board-history.service';

describe(NoticeBoardHistoryService.name, () => {
  let service: NoticeBoardHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeBoardHistoryService,
        {
          provide: getRepositoryToken(NoticeBoardHistory),
          useValue: mockNoticeBoardHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<NoticeBoardHistoryService>(NoticeBoardHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(NoticeBoardHistoryService.prototype.create.name, () => {
    let entityManager: any;
    let userId: number;
    let noticeBoardId: number;
    let createNoticeBoardHistoryDto: CreateNoticeBoardHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      noticeBoardId = NaN;
      createNoticeBoardHistoryDto = new CreateNoticeBoardHistoryDto({} as any);
    });

    it('create notice board history', async () => {
      mockNoticeBoardHistoryRepository.save.mockResolvedValue(
        createNoticeBoardHistoryDto,
      );

      await expect(
        service.create(
          entityManager,
          userId,
          noticeBoardId,
          createNoticeBoardHistoryDto,
        ),
      ).resolves.toEqual({});
    });
  });
});
