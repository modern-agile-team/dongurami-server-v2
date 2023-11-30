import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFreeBoardDto } from '@src/apis/free-boards/dto/create-free-board.dto';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { FreeBoardHistoryService } from '@src/apis/free-boards/free-board-history/services/free-board-history.service';
import { SortOrder } from '@src/constants/enum';
import { FreeBoard } from '@src/entities/FreeBoard';
import { QueryHelper } from '@src/helpers/query.helper';
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
});
