import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostCommentHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-comment-history.dto';
import { CreateFreePostHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-history.dto';
import { CreateFreePostReplyCommentHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-reply-comment-history.dto';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-comment-history.repository';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-reply-comment-history.repository';
import { HistoryAction } from '@src/constants/enum';
import {
  mockEntityManager,
  mockFreePostCommentHistoryRepository,
  mockFreePostHistoryRepository,
  mockFreePostReplyCommentHistoryRepository,
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
        {
          provide: FreePostCommentHistoryRepository,
          useValue: mockFreePostCommentHistoryRepository,
        },
        {
          provide: FreePostReplyCommentHistoryRepository,
          useValue: mockFreePostReplyCommentHistoryRepository,
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

  describe(FreePostHistoryService.prototype.createComment.name, () => {
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

    it('create comment history', async () => {
      mockFreePostHistoryRepository.findOneOrFail.mockResolvedValue({ id: 1 });
      mockFreePostCommentHistoryRepository.save.mockResolvedValue({});

      await expect(
        service.createComment(
          entityManager,
          userId,
          freePostId,
          action,
          createFreePostCommentHistoryDto,
        ),
      ).resolves.toEqual({});
    });
  });

  describe(FreePostHistoryService.prototype.createReplyComment.name, () => {
    let entityManager: any;
    let userId: number;
    let freePostId: number;
    let action: HistoryAction;
    let createFreePostReplyCommentHistoryDto: CreateFreePostReplyCommentHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      freePostId = NaN;
      action = null;
      createFreePostReplyCommentHistoryDto =
        new CreateFreePostReplyCommentHistoryDto({} as any);
    });

    it('create reply comment history', async () => {
      mockFreePostHistoryRepository.findOneOrFail.mockResolvedValue({
        id: 1,
      });
      mockFreePostCommentHistoryRepository.findOneOrFail.mockResolvedValue({
        id: 1,
      });
      mockFreePostReplyCommentHistoryRepository.save.mockResolvedValue({});

      await expect(
        service.createReplyComment(
          entityManager,
          userId,
          freePostId,
          action,
          createFreePostReplyCommentHistoryDto,
        ),
      ).resolves.toEqual({});
    });
  });
});
