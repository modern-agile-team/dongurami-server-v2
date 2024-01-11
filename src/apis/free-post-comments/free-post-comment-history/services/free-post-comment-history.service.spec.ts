import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostCommentHistoryDto } from '@src/apis/free-post-comments/free-post-comment-history/dto/create-free-post-comment-history.dto';
import { FreePostCommentHistoryRepository } from '@src/apis/free-post-comments/free-post-comment-history/repositories/free-post-comment-history.repository';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { HistoryAction } from '@src/constants/enum';
import {
  mockEntityManager,
  mockFreePostCommentHistoryRepository,
} from '@test/mock/mock.repository';
import { mockFreePostHistoryService } from '@test/mock/mock.service';
import { FreePostCommentHistoryService } from './free-post-comment-history.service';

describe(FreePostCommentHistoryService.name, () => {
  let service: FreePostCommentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostCommentHistoryService,
        {
          provide: FreePostHistoryService,
          useValue: mockFreePostHistoryService,
        },
        {
          provide: FreePostCommentHistoryRepository,
          useValue: mockFreePostCommentHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostCommentHistoryService>(
      FreePostCommentHistoryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostCommentHistoryService.prototype.create.name, () => {
    let entityManager: any;
    let userId: number;
    let freePostId: number;
    let action: HistoryAction;
    let createFreePostCommentHistoryDto: CreateFreePostCommentHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      freePostId = NaN;
      action = null;
      createFreePostCommentHistoryDto = new CreateFreePostCommentHistoryDto(
        {} as any,
      );
    });

    it('create free Post history', async () => {
      mockFreePostHistoryService.findOneOrFail.mockResolvedValue({ id: 1 });
      mockFreePostCommentHistoryRepository.save.mockResolvedValue(
        createFreePostCommentHistoryDto,
      );

      await expect(
        service.create(
          entityManager,
          userId,
          freePostId,
          action,
          createFreePostCommentHistoryDto,
        ),
      ).resolves.toBeInstanceOf(CreateFreePostCommentHistoryDto);
    });
  });

  describe(FreePostCommentHistoryService.prototype.findOneOrFail.name, () => {
    let entityManager: any;
    let options: any;

    beforeEach(() => {
      entityManager = mockEntityManager;
      options = {};
    });

    it('find one or fail', async () => {
      const newHistory = {};

      mockFreePostCommentHistoryRepository.findOneOrFail.mockResolvedValue(
        newHistory,
      );

      await expect(
        service.findOneOrFail(entityManager, options),
      ).resolves.toEqual(newHistory);

      expect(
        mockFreePostCommentHistoryRepository.findOneOrFail,
      ).toHaveBeenCalledWith(options);
    });
  });
});
