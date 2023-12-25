import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { SortOrder } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
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
});
