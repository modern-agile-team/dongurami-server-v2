import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { FreePostCommentsService } from '@src/apis/free-post-comments/services/free-post-comments.service';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/create-free-post-reply-comment.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-post-reply-comments/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/put-update-free-post-reply-comment.dto';
import { FreePostReplyCommentHistoryService } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/services/free-post-reply-comment-history.service';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
  mockFreePostReplyCommentRepository,
} from '@test/mock/mock.repository';
import {
  mockFreePostCommentsService,
  mockFreePostReplyCommentHistoryService,
  mockReactionsService,
} from '@test/mock/mock.service';
import { DataSource } from 'typeorm';
import { FreePostReplyCommentsService } from './free-post-reply-comments.service';

describe(FreePostReplyCommentsService.name, () => {
  let service: FreePostReplyCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostReplyCommentsService,
        {
          provide: FreePostCommentsService,
          useValue: mockFreePostCommentsService,
        },
        {
          provide: FreePostReplyCommentHistoryService,
          useValue: mockFreePostReplyCommentHistoryService,
        },
        {
          provide: ReactionsService,
          useValue: mockReactionsService,
        },
        {
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: FreePostReplyCommentRepository,
          useValue: mockFreePostReplyCommentRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostReplyCommentsService>(
      FreePostReplyCommentsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostReplyCommentsService.prototype.create.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostReplyCommentId: number;
    let createFreePostReplyCommentDto: CreateFreePostReplyCommentDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      freePostReplyCommentId = NaN;
      createFreePostReplyCommentDto = new CreateFreePostReplyCommentDto();
    });

    it('not found free post reply comment throw HttpNotFoundException', async () => {
      mockFreePostCommentsService.findOneOrNotFound.mockImplementation(
        async () => {
          throw new HttpNotFoundException({} as any);
        },
      );

      await expect(
        service.create(
          userId,
          freePostId,
          freePostReplyCommentId,
          createFreePostReplyCommentDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('create free post reply comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostReplyCommentId = faker.number.int();

      mockFreePostCommentsService.findOneOrNotFound.mockResolvedValue({
        id: 1,
      });
      mockFreePostReplyCommentRepository.save.mockResolvedValue({ id: 1 });

      await expect(
        service.create(
          userId,
          freePostId,
          freePostReplyCommentId,
          createFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);

      expect(
        mockFreePostReplyCommentHistoryService.create,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Insert,
        expect.anything(),
      );
    });
  });

  describe(FreePostReplyCommentsService.prototype.findAllAndCount.name, () => {
    let freePostId: number;
    let freePostCommentId: number;
    let findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto;

    let freePostReplyComments: [];
    let count: number;

    beforeEach(() => {
      freePostId = NaN;
      freePostCommentId = NaN;
      findFreePostReplyCommentListQueryDto =
        new FindFreePostReplyCommentListQueryDto();

      freePostReplyComments = [];
      count = NaN;
    });

    it('not found free post reply comment throw HttpNotFoundException', async () => {
      mockFreePostCommentsService.findOneOrNotFound.mockImplementation(
        async () => {
          throw new HttpNotFoundException({} as any);
        },
      );

      await expect(
        service.findAllAndCount(
          freePostId,
          freePostCommentId,
          findFreePostReplyCommentListQueryDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('default option findAllAndCountReplyComment', async () => {
      findFreePostReplyCommentListQueryDto.page = 0;
      findFreePostReplyCommentListQueryDto.pageSize = 20;
      findFreePostReplyCommentListQueryDto.order = { id: SortOrder.Desc };

      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      count = faker.number.int();

      mockFreePostCommentsService.findOneOrNotFound.mockResolvedValue({
        id: freePostId,
      });
      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreePostReplyCommentRepository.findAndCount.mockResolvedValue([
        freePostReplyComments,
        count,
      ]);

      await expect(
        service.findAllAndCount(
          freePostId,
          freePostCommentId,
          findFreePostReplyCommentListQueryDto,
        ),
      ).resolves.toEqual([freePostReplyComments, count]);

      expect(
        mockFreePostReplyCommentRepository.findAndCount,
      ).toHaveBeenCalledWith({
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(
    FreePostReplyCommentsService.prototype.findOneOrNotFound.name,
    () => {
      let freePostId: number;
      let freePostCommentId: number;
      let freePostReplyCommentId: number;

      let existReplyComment: FreePostReplyCommentDto;

      beforeEach(() => {
        freePostId = NaN;
        freePostCommentId = NaN;
        freePostReplyCommentId = NaN;

        existReplyComment = new FreePostReplyCommentDto();
      });

      it('not found free post reply comment throw HttpNotFoundException', async () => {
        mockFreePostReplyCommentRepository.findOne.mockResolvedValue(null);

        await expect(
          service.findOneOrNotFound(
            freePostId,
            freePostCommentId,
            freePostReplyCommentId,
          ),
        ).rejects.toThrow(HttpNotFoundException);
      });

      it('find one free post reply comment', async () => {
        freePostId = faker.number.int();
        freePostCommentId = faker.number.int();
        freePostReplyCommentId = faker.number.int();

        mockFreePostReplyCommentRepository.findOne.mockResolvedValue(
          existReplyComment,
        );

        await expect(
          service.findOneOrNotFound(
            freePostId,
            freePostCommentId,
            freePostReplyCommentId,
          ),
        ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
      });
    },
  );

  describe(FreePostReplyCommentsService.prototype.putUpdate.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;
    let putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      freePostCommentId = NaN;
      freePostReplyCommentId = NaN;
      putUpdateFreePostReplyCommentDto = new PutUpdateFreePostReplyCommentDto();
    });

    it('not found free post reply comment throw HttpNotFoundException', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('put update free post reply comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        userId,
      });
      mockFreePostReplyCommentRepository.update.mockResolvedValue(undefined);

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);

      expect(
        mockFreePostReplyCommentHistoryService.create,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Update,
        expect.anything(),
      );
    });
  });

  describe(FreePostReplyCommentsService.prototype.remove.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      freePostCommentId = NaN;
      freePostReplyCommentId = NaN;
    });

    it('not found free post reply comment throw HttpNotFoundException', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.remove(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('remove free post reply comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        userId,
      });
      mockFreePostReplyCommentRepository.update.mockResolvedValue({
        affected: 1,
      });

      await expect(
        service.remove(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).resolves.toBe(1);

      expect(
        mockFreePostReplyCommentHistoryService.create,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Delete,
        expect.anything(),
      );
    });
  });

  describe(FreePostCommentsService.prototype.createReaction.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;
    let createReactionDto: CreateReactionDto;

    beforeEach(() => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();
      createReactionDto = new CreateReactionDto();
    });

    it('not found comment throw HttpNotFoundException', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReaction(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          createReactionDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('create reaction', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        freePostId,
      });
      mockReactionsService.create.mockResolvedValue(undefined);

      await expect(
        service.createReaction(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          createReactionDto,
        ),
      ).resolves.toBeUndefined();
    });
  });

  describe(FreePostCommentsService.prototype.removeReaction.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;
    let removeReactionDto: RemoveReactionDto;

    beforeEach(() => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();
      removeReactionDto = new RemoveReactionDto();
    });

    it('not found comment throw HttpNotFoundException', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReaction(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          removeReactionDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('remove reaction', async () => {
      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({
        freePostId,
      });
      mockReactionsService.remove.mockResolvedValue(undefined);

      await expect(
        service.removeReaction(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          removeReactionDto,
        ),
      ).resolves.toBeUndefined();
    });
  });
});
