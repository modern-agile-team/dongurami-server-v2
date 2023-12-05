import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFreeBoardHistoryDto } from '@src/apis/free-boards/free-board-history/dto/create-free-board-history.dto';
import { HistoryAction } from '@src/constants/enum';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import {
  mockEntityManager,
  mockFreeBoardHistoryRepository,
} from '@test/mock/mock.repository';
import { FreeBoardHistoryService } from './free-board-history.service';

describe(FreeBoardHistoryService.name, () => {
  let service: FreeBoardHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreeBoardHistoryService,
        {
          provide: getRepositoryToken(FreeBoardHistory),
          useValue: mockFreeBoardHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<FreeBoardHistoryService>(FreeBoardHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreeBoardHistoryService.prototype.create.name, () => {
    let entityManager: any;
    let userId: number;
    let freeBoardId: number;
    let action: HistoryAction;
    let createFreeBoardHistoryDto: CreateFreeBoardHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      freeBoardId = NaN;
      action = null;
      createFreeBoardHistoryDto = new CreateFreeBoardHistoryDto({} as any);
    });

    it('create free board history', async () => {
      mockFreeBoardHistoryRepository.save.mockResolvedValue(
        createFreeBoardHistoryDto,
      );

      await expect(
        service.create(
          entityManager,
          userId,
          freeBoardId,
          action,
          createFreeBoardHistoryDto,
        ),
      ).resolves.toEqual({});
    });
  });
});
