import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-history.dto';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { HistoryAction } from '@src/constants/enum';
import {
  mockEntityManager,
  mockFreePostHistoryRepository,
} from '@test/mock/mock.repository';
import { FreePostHistoryService } from './free-post-history.service';

describe(FreePostHistoryService.name, () => {
  let service: FreePostHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostHistoryService,
        {
          provide: FreePostHistoryRepository,
          useValue: mockFreePostHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostHistoryService>(FreePostHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostHistoryService.prototype.create.name, () => {
    let entityManager: any;
    let userId: number;
    let freePostId: number;
    let action: HistoryAction;
    let createFreePostHistoryDto: CreateFreePostHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      freePostId = NaN;
      action = null;
      createFreePostHistoryDto = new CreateFreePostHistoryDto({} as any);
    });

    it('create free Post history', async () => {
      mockFreePostHistoryRepository.save.mockResolvedValue(
        createFreePostHistoryDto,
      );

      await expect(
        service.create(
          entityManager,
          userId,
          freePostId,
          action,
          createFreePostHistoryDto,
        ),
      ).resolves.toEqual({});
    });
  });
});
