import { Test, TestingModule } from '@nestjs/testing';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { CreateFreePostReplyCommentHistoryDto } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/dto/create-free-post-reply-comment-history.dto';
import { HistoryAction } from '@src/constants/enum';
import {
  mockEntityManager,
  mockFreePostReplyCommentHistoryRepository,
} from '@test/mock/mock.repository';
import { mockFreePostCommentHistoryService } from '@test/mock/mock.service';
import { FreePostReplyCommentHistoryRepository } from '../repositories/free-post-reply-comment-history.repository';
import { FreePostReplyCommentHistoryService } from './free-post-reply-comment-history.service';

describe(FreePostReplyCommentHistoryService.name, () => {
  let service: FreePostReplyCommentHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostReplyCommentHistoryService,
        {
          provide: FreePostCommentHistoryService,
          useValue: mockFreePostCommentHistoryService,
        },
        {
          provide: FreePostReplyCommentHistoryRepository,
          useValue: mockFreePostReplyCommentHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostReplyCommentHistoryService>(
      FreePostReplyCommentHistoryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostReplyCommentHistoryService.prototype.create.name, () => {
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

    it('create free Post history', async () => {
      mockFreePostCommentHistoryService.findOneOrFail.mockResolvedValue({
        id: 1,
      });
      mockFreePostReplyCommentHistoryRepository.save.mockResolvedValue(
        createFreePostReplyCommentHistoryDto,
      );

      await expect(
        service.create(
          entityManager,
          userId,
          freePostId,
          action,
          createFreePostReplyCommentHistoryDto,
        ),
      ).resolves.toBeInstanceOf(CreateFreePostReplyCommentHistoryDto);
    });
  });
});
