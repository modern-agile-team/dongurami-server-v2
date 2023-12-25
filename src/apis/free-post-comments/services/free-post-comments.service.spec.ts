import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-post-comments/dto/put-update-free-post-comment.dto';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { FreePostCommentRepository } from '@src/apis/free-post-comments/repositories/free-post-comment.repository';
import { FreePostsService } from '@src/apis/free-posts/services/free-posts.service';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { FreePostComment } from '@src/entities/FreePostComment';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
  mockFreePostCommentRepository,
} from '@test/mock/mock.repository';
import {
  mockFreePostCommentHistoryService,
  mockFreePostsService,
} from '@test/mock/mock.service';
import { DataSource } from 'typeorm';
import { FreePostCommentsService } from './free-post-comments.service';

describe(FreePostCommentsService.name, () => {
  let service: FreePostCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostCommentsService,
        {
          provide: FreePostsService,
          useValue: mockFreePostsService,
        },
        {
          provide: FreePostCommentHistoryService,
          useValue: mockFreePostCommentHistoryService,
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
          provide: FreePostCommentRepository,
          useValue: mockFreePostCommentRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostCommentsService>(FreePostCommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostCommentsService.prototype.create.name, () => {
    let userId: number;
    let freePostId: number;
    let createFreePostCommentDto: CreateFreePostCommentDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      createFreePostCommentDto = new CreateFreePostCommentDto();
    });

    it('not found free post comment throw HttpNotFoundException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostsService.findOneOrNotFound.mockImplementation(async () => {
        throw new HttpNotFoundException({} as any);
      });

      await expect(
        service.create(userId, freePostId, createFreePostCommentDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('create free post comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostsService.findOneOrNotFound.mockResolvedValue({ id: 1 });
      mockFreePostCommentRepository.save.mockResolvedValue({ id: 1 });

      await expect(
        service.create(userId, freePostId, createFreePostCommentDto),
      ).resolves.toBeInstanceOf(FreePostCommentDto);

      expect(mockFreePostCommentHistoryService.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Insert,
        expect.anything(),
      );
    });
  });

  describe(FreePostCommentsService.prototype.findAllAndCount.name, () => {
    let freePostId: number;
    let findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto;

    let freePostComments: [];
    let count: number;

    beforeEach(() => {
      freePostId = NaN;
      findFreePostCommentListQueryDto = new FindFreePostCommentListQueryDto();

      freePostComments = [];
      count = NaN;
    });

    it('not found free post comment throw HttpNotFoundException', async () => {
      mockFreePostsService.findOneOrNotFound.mockImplementation(async () => {
        throw new HttpNotFoundException({} as any);
      });

      await expect(
        service.findAllAndCount(freePostId, findFreePostCommentListQueryDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('default option findAllAndCountComment', async () => {
      findFreePostCommentListQueryDto.page = 0;
      findFreePostCommentListQueryDto.pageSize = 20;
      findFreePostCommentListQueryDto.order = { id: SortOrder.Desc };

      freePostId = faker.number.int();

      count = faker.number.int();

      mockFreePostsService.findOneOrNotFound.mockResolvedValue({
        id: freePostId,
      });
      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreePostCommentRepository.findAndCount.mockResolvedValue([
        freePostComments,
        count,
      ]);

      await expect(
        service.findAllAndCount(freePostId, findFreePostCommentListQueryDto),
      ).resolves.toEqual([freePostComments, count]);

      expect(mockFreePostCommentRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(FreePostCommentsService.prototype.findOneOrNotFound.name, () => {
    let freePostId: number;
    let freePostCommentId: number;

    let existComment: FreePostComment;

    beforeEach(() => {
      freePostId = NaN;
      freePostCommentId = NaN;

      existComment = new FreePostComment();
    });

    it('not found free post comment throw HttpNotFoundException', async () => {
      mockFreePostCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOneOrNotFound(freePostId, freePostCommentId),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('find one free post comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue(existComment);

      await expect(
        service.findOneOrNotFound(freePostId, freePostCommentId),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostCommentsService.prototype.putUpdate.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;
    let putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      freePostCommentId = NaN;
      putUpdateFreePostCommentDto = new PutUpdateFreePostCommentDto();
    });

    it('not found free post comment throw HttpNotFoundException', async () => {
      mockFreePostCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('put update free post comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({ userId });
      mockFreePostCommentRepository.update.mockResolvedValue(undefined);

      await expect(
        service.putUpdate(
          userId,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostCommentDto);

      expect(mockFreePostCommentHistoryService.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Update,
        expect.anything(),
      );
    });
  });

  describe(FreePostCommentsService.prototype.remove.name, () => {
    let userId: number;
    let freePostId: number;
    let freePostCommentId: number;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      freePostCommentId = NaN;
    });

    it('not found free post comment throw HttpNotFoundException', async () => {
      mockFreePostCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(userId, freePostId, freePostCommentId),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.remove(userId, freePostId, freePostCommentId),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('remove free post comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({ userId });
      mockFreePostCommentRepository.update.mockResolvedValue({ affected: 1 });

      await expect(
        service.remove(userId, freePostId, freePostCommentId),
      ).resolves.toBe(1);

      expect(mockFreePostCommentHistoryService.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Delete,
        expect.anything(),
      );
    });
  });
});
