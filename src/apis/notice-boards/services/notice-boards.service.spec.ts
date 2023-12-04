import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SortOrder } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { mockQueryHelper } from '@test/mock/mock.helper';
import {
  mockDataSource,
  mockNoticeBoardRepository,
} from '@test/mock/mock.repository';
import { mockNoticeBoardHistoryService } from '@test/mock/mock.service';
import { DataSource } from 'typeorm';
import { NoticeBoardsService } from './notice-boards.service';
import { NoticeBoardDto } from '../dto/notice-board.dto';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { NoticeBoardHistoryService } from '../notice-board-history/services/notice-board-history.service';
import { NoticeBoard } from '@src/entities/NoticeBoard';
import { FindNoticeBoardListQueryDto } from '../dto/find-notice-board-list-query.dto';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

describe(NoticeBoardsService.name, () => {
  let service: NoticeBoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeBoardsService,
        {
          provide: NoticeBoardHistoryService,
          useValue: mockNoticeBoardHistoryService,
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
          provide: getRepositoryToken(NoticeBoard),
          useValue: mockNoticeBoardRepository,
        },
      ],
    }).compile();

    service = module.get<NoticeBoardsService>(NoticeBoardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(NoticeBoardsService.prototype.create.name, () => {
    let userId: number;
    let createNoticeBoardDto: CreateNoticeBoardDto;

    beforeEach(() => {
      userId = NaN;
      createNoticeBoardDto = new CreateNoticeBoardDto();
    });

    it('create notice board', async () => {
      userId = faker.number.int();

      mockNoticeBoardRepository.save.mockResolvedValue({ id: 1 });

      await expect(
        service.create(userId, createNoticeBoardDto),
      ).resolves.toEqual({
        id: 1,
      });

      expect(mockNoticeBoardHistoryService.create).toHaveBeenCalled();
    });
  });

  describe(NoticeBoardsService.prototype.findAllAndCount.name, () => {
    let findNoticeBoardListQueryDto: FindNoticeBoardListQueryDto;

    let noticeBoards: NoticeBoardDto[];
    let count: number;

    beforeEach(() => {
      findNoticeBoardListQueryDto = new FindNoticeBoardListQueryDto();

      noticeBoards = [];
      count = NaN;
    });

    it('default option findAllAndCount', async () => {
      findNoticeBoardListQueryDto.page = 0;
      findNoticeBoardListQueryDto.pageSize = 20;
      findNoticeBoardListQueryDto.order = { id: SortOrder.Desc };

      mockQueryHelper.buildWherePropForFind.mockReturnValue({});
      mockNoticeBoardRepository.findAndCount.mockResolvedValue([
        noticeBoards,
        count,
      ]);

      await expect(
        service.findAllAndCount(findNoticeBoardListQueryDto),
      ).resolves.toEqual([noticeBoards, count]);

      expect(mockNoticeBoardRepository.findAndCount).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {},
        order: { id: SortOrder.Desc },
        skip: 0,
        take: 20,
      });
    });
  });

  describe(NoticeBoardsService.prototype.findOneOrNotFound.name, () => {
    let noticeBoardId: number;

    let noticeBoardDto: NoticeBoardDto;

    beforeEach(() => {
      noticeBoardId = NaN;

      noticeBoardDto = new NoticeBoardDto();
    });

    it('not found notice board', async () => {
      noticeBoardId = faker.number.int();

      mockNoticeBoardRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneOrNotFound(noticeBoardId)).rejects.toThrow(
        HttpNotFoundException,
      );
    });

    it('find one notice board', async () => {
      noticeBoardId = faker.number.int();

      mockNoticeBoardRepository.findOneBy.mockResolvedValue(noticeBoardDto);

      await expect(
        service.findOneOrNotFound(noticeBoardId),
      ).resolves.toBeInstanceOf(NoticeBoardDto);
    });
  });
});
