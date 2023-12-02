import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFreeBoardDto } from '@src/apis/free-boards/dto/create-free-board.dto';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { PatchUpdateFreeBoardDto } from '@src/apis/free-boards/dto/patch-update-free-board.dto.td';
import { FreeBoardHistoryService } from '@src/apis/free-boards/free-board-history/services/free-board-history.service';
import { SortOrder } from '@src/constants/enum';
import { FreeBoard } from '@src/entities/FreeBoard';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
  mockFreeBoardRepository,
} from '@test/mock/mock.repository';
import { mockFreeBoardHistoryService } from '@test/mock/mock.service';
import { DataSource } from 'typeorm';
import { FreeBoardsService } from './free-board.service';

describe(FreeBoardsService.name, () => {
  let service: FreeBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreeBoardsService,
        {
          provide: FreeBoardHistoryService,
          useValue: mockFreeBoardHistoryService,
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
          provide: getRepositoryToken(FreeBoard),
          useValue: mockFreeBoardRepository,
        },
      ],
    }).compile();

    service = module.get<FreeBoardsService>(FreeBoardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(FreeBoardsService.prototype.create.name, () => {
    let userId: number;
    let createFreeBoardDto: CreateFreeBoardDto;

    beforeEach(() => {
      userId = NaN;
      createFreeBoardDto = new CreateFreeBoardDto();
    });

    it('create free board', async () => {
      userId = faker.number.int();

      mockFreeBoardRepository.save.mockResolvedValue({ id: 1 });

      await expect(service.create(userId, createFreeBoardDto)).resolves.toEqual(
        { id: 1 },
      );

      expect(mockFreeBoardHistoryService.create).toHaveBeenCalled();
    });
  });

  describe(FreeBoardsService.prototype.findAllAndCount.name, () => {
    let findFreeBoardListQueryDto: FindFreeBoardListQueryDto;

    let freeBoards: FreeBoardDto[];
    let count: number;

    beforeEach(() => {
      findFreeBoardListQueryDto = new FindFreeBoardListQueryDto();

      freeBoards = [];
      count = NaN;
    });

    it('default option findAllAndCount', async () => {
      findFreeBoardListQueryDto.page = 0;
      findFreeBoardListQueryDto.pageSize = 20;
      findFreeBoardListQueryDto.order = { id: SortOrder.Desc };

      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockFreeBoardRepository.findAndCount.mockResolvedValue([
        freeBoards,
        count,
      ]);

      await expect(
        service.findAllAndCount(findFreeBoardListQueryDto),
      ).resolves.toEqual([freeBoards, count]);

      expect(mockFreeBoardRepository.findAndCount).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(FreeBoardsService.prototype.patchUpdate.name, () => {
    let userId: number;
    let freeBoardId: number;
    let patchUpdateFreeBoardDto: PatchUpdateFreeBoardDto;

    let freeBoardDto: FreeBoardDto;

    beforeEach(() => {
      userId = NaN;
      freeBoardId = NaN;
      patchUpdateFreeBoardDto = new PatchUpdateFreeBoardDto();

      freeBoardDto = new FreeBoardDto();
    });

    it('missing update field throw HttpBadRequestException', async () => {
      userId = faker.number.int();
      freeBoardId = faker.number.int();

      await expect(
        service.patchUpdate(userId, freeBoardId, patchUpdateFreeBoardDto),
      ).rejects.toThrow(HttpBadRequestException);
    });

    it('not found free board throw HttpNotFoundException', async () => {
      userId = faker.number.int();
      freeBoardId = faker.number.int();

      patchUpdateFreeBoardDto.title = 'title';

      mockFreeBoardRepository.findOne.mockResolvedValue(null);

      await expect(
        service.patchUpdate(userId, freeBoardId, patchUpdateFreeBoardDto),
      ).rejects.toThrow(HttpNotFoundException);
    });

    it('not owner throw HttpForbiddenException', async () => {
      userId = faker.number.int();
      freeBoardId = faker.number.int();

      patchUpdateFreeBoardDto.title = 'title';

      mockFreeBoardRepository.findOne.mockResolvedValue({ userId: userId + 1 });

      await expect(
        service.patchUpdate(userId, freeBoardId, patchUpdateFreeBoardDto),
      ).rejects.toThrow(HttpForbiddenException);
    });

    it('update title', async () => {
      userId = faker.number.int();
      freeBoardId = faker.number.int();
      patchUpdateFreeBoardDto.title = 'updated title';

      freeBoardDto.title = patchUpdateFreeBoardDto.title;

      mockFreeBoardRepository.findOne.mockResolvedValue({ userId: userId });
      mockFreeBoardRepository.findOneByOrFail.mockResolvedValue(freeBoardDto);

      await expect(
        service.patchUpdate(userId, freeBoardId, patchUpdateFreeBoardDto),
      ).resolves.toBeInstanceOf(FreeBoardDto);
    });
  });
});
