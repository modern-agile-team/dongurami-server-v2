import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { CreateFreePostCommentDto } from '@src/apis/free-posts/dto/create-free-post-comment.dto';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/create-free-post-reply-comment.dto';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-comment-list-query.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-posts/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-posts/dto/free-post-comment.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-posts/dto/free-post-reply-comment.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-comment.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/put-update-free-post-reply-comment.dto';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { FreePostCommentRepository } from '@src/apis/free-posts/repositories/free-post-comment.repository';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { FreePostComment } from '@src/entities/FreePostComment';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
  mockFreePostCommentRepository,
  mockFreePostReplyCommentRepository,
  mockFreePostRepository,
} from '@test/mock/mock.repository';
import {
  mockCommonPostsService,
  mockFreePostHistoryService,
} from '@test/mock/mock.service';
import { DataSource } from 'typeorm';
import { FreePostsService } from './free-posts.service';

describe(FreePostsService.name, () => {
  let service: FreePostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreePostsService,
        {
          provide: FreePostHistoryService,
          useValue: mockFreePostHistoryService,
        },
        {
          provide: CommonPostsService,
          useValue: mockCommonPostsService,
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
          provide: FreePostRepository,
          useValue: mockFreePostRepository,
        },
        {
          provide: FreePostCommentRepository,
          useValue: mockFreePostCommentRepository,
        },
        {
          provide: FreePostReplyCommentRepository,
          useValue: mockFreePostReplyCommentRepository,
        },
      ],
    }).compile();

    service = module.get<FreePostsService>(FreePostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreePostsService.prototype.create.name, () => {
    let userId: number;
    let createFreePostDto: CreateFreePostDto;

    beforeEach(() => {
      userId = NaN;
      createFreePostDto = new CreateFreePostDto();
    });

    it('create free Post', async () => {
      userId = faker.number.int();

      mockFreePostRepository.save.mockResolvedValue({ id: 1 });

      await expect(service.create(userId, createFreePostDto)).resolves.toEqual({
        id: 1,
      });

      expect(mockFreePostHistoryService.create).toHaveBeenCalled();
    });
  });

  describe(FreePostsService.prototype.findAllAndCount.name, () => {
    let findFreePostListQueryDto: FindFreePostListQueryDto;

    let freePosts: FreePostDto[];
    let count: number;

    beforeEach(() => {
      findFreePostListQueryDto = new FindFreePostListQueryDto();

      freePosts = [];
      count = NaN;
    });

    it('default option findAllAndCount', async () => {
      findFreePostListQueryDto.page = 0;
      findFreePostListQueryDto.pageSize = 20;
      findFreePostListQueryDto.order = { id: SortOrder.Desc };

      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreePostRepository.findAndCount.mockResolvedValue([freePosts, count]);

      await expect(
        service.findAllAndCount(findFreePostListQueryDto),
      ).resolves.toEqual([freePosts, count]);

      expect(mockFreePostRepository.findAndCount).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(FreePostsService.prototype.findOneOrNotFound.name, () => {
    let freePostId: number;

    let freePostDto: FreePostDto;

    beforeEach(() => {
      freePostId = NaN;

      freePostDto = new FreePostDto();
    });

    it('not found free Post', async () => {
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneOrNotFound(freePostId)).rejects.toThrow(
        HttpNotFoundException,
      );
    });

    it('find one free Post', async () => {
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue(freePostDto);

      await expect(
        service.findOneOrNotFound(freePostId),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsService.prototype.putUpdate.name, () => {
    let userId: number;
    let freePostId: number;
    let putUpdateFreePostDto: PutUpdateFreePostDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      putUpdateFreePostDto = new PutUpdateFreePostDto();
    });

    it('not found free Post throw httpNotFound', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.putUpdate(userId, freePostId, putUpdateFreePostDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw httpForbidden', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.putUpdate(userId, freePostId, putUpdateFreePostDto),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('update free Post and create history', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      putUpdateFreePostDto.title = 'newTitle';
      putUpdateFreePostDto.description = 'newDescription';
      putUpdateFreePostDto.isAnonymous = false;

      mockFreePostRepository.findOneBy.mockResolvedValue({ userId });
      mockFreePostRepository.findOneByOrFail.mockResolvedValue({
        putUpdateFreePostDto,
      });

      await expect(
        service.putUpdate(userId, freePostId, putUpdateFreePostDto),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsService.prototype.patchUpdate.name, () => {
    let userId: number;
    let freePostId: number;
    let patchUpdateFreePostDto: PatchUpdateFreePostDto;

    let freePostDto: FreePostDto;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
      patchUpdateFreePostDto = new PatchUpdateFreePostDto();

      freePostDto = new FreePostDto();
    });

    it('missing update field throw HttpBadRequestException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      await expect(
        service.patchUpdate(userId, freePostId, patchUpdateFreePostDto),
      ).rejects.toThrow(HttpBadRequestException);
    });

    it('not found free Post throw HttpNotFoundException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      patchUpdateFreePostDto.title = 'title';

      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.patchUpdate(userId, freePostId, patchUpdateFreePostDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      patchUpdateFreePostDto.title = 'title';

      mockFreePostRepository.findOneBy.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.patchUpdate(userId, freePostId, patchUpdateFreePostDto),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('update title', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      patchUpdateFreePostDto.title = 'updated title';

      freePostDto.title = patchUpdateFreePostDto.title;

      mockFreePostRepository.findOneBy.mockResolvedValue({ userId: userId });
      mockFreePostRepository.findOneByOrFail.mockResolvedValue(freePostDto);

      await expect(
        service.patchUpdate(userId, freePostId, patchUpdateFreePostDto),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsService.prototype.remove.name, () => {
    let userId: number;
    let freePostId: number;

    beforeEach(() => {
      userId = NaN;
      freePostId = NaN;
    });

    it('not found free Post throw HttpNotFoundException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(userId, freePostId)).rejects.toThrow(
        HttpNotFoundException,
      );
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(service.remove(userId, freePostId)).rejects.toThrow(
        HttpForbiddenException,
      );
    });

    it('remove free Post', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue({ userId: userId });
      mockFreePostRepository.update.mockResolvedValue({ affected: 1 });

      await expect(service.remove(userId, freePostId)).resolves.toBe(1);
    });
  });

  describe(FreePostsService.prototype.incrementHit.name, () => {
    let freePostId: number;

    beforeEach(() => {
      freePostId = NaN;
    });

    it('increment hit', async () => {
      freePostId = faker.number.int();

      mockCommonPostsService.incrementHit.mockResolvedValue(undefined);

      await expect(service.incrementHit(freePostId)).resolves.toBeUndefined();
    });
  });

  describe(FreePostsService.prototype.createComment.name, () => {
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

      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createComment(userId, freePostId, createFreePostCommentDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('create free post comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue({ id: 1 });
      mockFreePostCommentRepository.save.mockResolvedValue({ id: 1 });

      await expect(
        service.createComment(userId, freePostId, createFreePostCommentDto),
      ).resolves.toBeInstanceOf(FreePostCommentDto);

      expect(mockFreePostHistoryService.createComment).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Insert,
        expect.anything(),
      );
    });
  });

  describe(FreePostsService.prototype.findAllAndCountComment.name, () => {
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
      mockFreePostRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findAllAndCountComment(
          freePostId,
          findFreePostCommentListQueryDto,
        ),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('default option findAllAndCountComment', async () => {
      findFreePostCommentListQueryDto.page = 0;
      findFreePostCommentListQueryDto.pageSize = 20;
      findFreePostCommentListQueryDto.order = { id: SortOrder.Desc };

      freePostId = faker.number.int();

      count = faker.number.int();

      mockFreePostRepository.findOneBy.mockResolvedValue({ id: freePostId });
      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreePostCommentRepository.findAndCount.mockResolvedValue([
        freePostComments,
        count,
      ]);

      await expect(
        service.findAllAndCountComment(
          freePostId,
          findFreePostCommentListQueryDto,
        ),
      ).resolves.toEqual([freePostComments, count]);

      expect(mockFreePostCommentRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(FreePostsService.prototype.findOneOrNotFoundComment.name, () => {
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
        service.findOneOrNotFoundComment(freePostId, freePostCommentId),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('find one free post comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue(existComment);

      await expect(
        service.findOneOrNotFoundComment(freePostId, freePostCommentId),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostsService.prototype.putUpdateComment.name, () => {
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
        service.putUpdateComment(
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
        service.putUpdateComment(
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
        service.putUpdateComment(
          userId,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostCommentDto);

      expect(mockFreePostHistoryService.createComment).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Update,
        expect.anything(),
      );
    });
  });

  describe(FreePostsService.prototype.removeComment.name, () => {
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
        service.removeComment(userId, freePostId, freePostCommentId),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({
        userId: userId + 1,
      });

      await expect(
        service.removeComment(userId, freePostId, freePostCommentId),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('remove free post comment', async () => {
      userId = faker.number.int();
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostCommentRepository.findOne.mockResolvedValue({ userId });
      mockFreePostCommentRepository.update.mockResolvedValue({ affected: 1 });

      await expect(
        service.removeComment(userId, freePostId, freePostCommentId),
      ).resolves.toBe(1);

      expect(mockFreePostHistoryService.createComment).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Delete,
        expect.anything(),
      );
    });
  });

  describe(FreePostsService.prototype.createReplyComment.name, () => {
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
      mockFreePostCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createReplyComment(
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

      mockFreePostCommentRepository.findOne.mockResolvedValue({ id: 1 });
      mockFreePostReplyCommentRepository.save.mockResolvedValue({ id: 1 });

      await expect(
        service.createReplyComment(
          userId,
          freePostId,
          freePostReplyCommentId,
          createFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);

      expect(
        mockFreePostHistoryService.createReplyComment,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Insert,
        expect.anything(),
      );
    });
  });

  describe(FreePostsService.prototype.findAllAndCountReplyComment.name, () => {
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
      mockFreePostCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findAllAndCountReplyComment(
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

      mockFreePostCommentRepository.findOne.mockResolvedValue({
        id: freePostId,
      });
      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreePostReplyCommentRepository.findAndCount.mockResolvedValue([
        freePostReplyComments,
        count,
      ]);

      await expect(
        service.findAllAndCountReplyComment(
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
    FreePostsService.prototype.findOneOrNotFoundReplyComment.name,
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
          service.findOneOrNotFoundReplyComment(
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
          service.findOneOrNotFoundReplyComment(
            freePostId,
            freePostCommentId,
            freePostReplyCommentId,
          ),
        ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
      });
    },
  );

  describe(FreePostsService.prototype.putUpdateReplyComment.name, () => {
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
        service.putUpdateReplyComment(
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
        service.putUpdateReplyComment(
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

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({ userId });
      mockFreePostReplyCommentRepository.update.mockResolvedValue(undefined);

      await expect(
        service.putUpdateReplyComment(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);

      expect(
        mockFreePostHistoryService.createReplyComment,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Update,
        expect.anything(),
      );
    });
  });

  describe(FreePostsService.prototype.removeReplyComment.name, () => {
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
        service.removeReplyComment(
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
        service.removeReplyComment(
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

      mockFreePostReplyCommentRepository.findOne.mockResolvedValue({ userId });
      mockFreePostReplyCommentRepository.update.mockResolvedValue({
        affected: 1,
      });

      await expect(
        service.removeReplyComment(
          userId,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).resolves.toBe(1);

      expect(
        mockFreePostHistoryService.createReplyComment,
      ).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        HistoryAction.Delete,
        expect.anything(),
      );
    });
  });
});
