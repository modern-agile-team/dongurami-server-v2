import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockNoticeBoardsService } from '@test/mock/mock.service';
import { CreateNoticeBoardDto } from '../dto/create-notice-board.dto';
import { FindNoticeBoardListQueryDto } from '../dto/find-notice-board-list-query.dto';
import { NoticeBoardDto } from '../dto/notice-board.dto';
import { NoticeBoardsService } from '../services/notice-boards.service';
import { NoticeBoardsController } from './notice-boards.controller';
import { PutUpdateNoticeBoardDto } from '../dto/put-update-notice-board.dto';

describe(NoticeBoardsController.name, () => {
  let controller: NoticeBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeBoardsController],
      providers: [
        {
          provide: NoticeBoardsService,
          useValue: mockNoticeBoardsService,
        },
      ],
    }).compile();

    controller = module.get<NoticeBoardsController>(NoticeBoardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(NoticeBoardsController.prototype.create.name, () => {
    let user: UserDto;
    let createNoticeBoardDto: CreateNoticeBoardDto;

    let newNoticeBoard: NoticeBoardDto;

    beforeEach(() => {
      user = new UserDto();
      createNoticeBoardDto = new CreateNoticeBoardDto();

      newNoticeBoard = new NoticeBoardDto();
    });

    it('create notice board', async () => {
      user.id = faker.number.int();

      mockNoticeBoardsService.create.mockResolvedValue(newNoticeBoard);

      await expect(
        controller.create(user, createNoticeBoardDto),
      ).resolves.toEqual(newNoticeBoard);
    });
  });

  describe(NoticeBoardsController.prototype.findAllAndCount.name, () => {
    let findNoticeBoardListQueryDto: FindNoticeBoardListQueryDto;

    beforeEach(() => {
      findNoticeBoardListQueryDto = new FindNoticeBoardListQueryDto();
    });

    it('find all and count', async () => {
      mockNoticeBoardsService.findAllAndCount.mockResolvedValue([[], 0]);

      await expect(
        controller.findAllAndCount(findNoticeBoardListQueryDto),
      ).resolves.toEqual([[], 0]);
    });
  });

  describe(NoticeBoardsController.prototype.findOneOrNotFound.name, () => {
    let noticeBoardId: number;

    let noticeBoardDto: NoticeBoardDto;

    beforeEach(() => {
      noticeBoardId = NaN;

      noticeBoardDto = new NoticeBoardDto();
    });

    it('findOneNoticeBoard', async () => {
      noticeBoardId = faker.number.int();

      mockNoticeBoardsService.findOneOrNotFound.mockResolvedValue(
        noticeBoardDto,
      );

      await expect(
        controller.findOneOrNotFound(noticeBoardId),
      ).resolves.toBeInstanceOf(NoticeBoardDto);
    });
  });

  describe(NoticeBoardsController.prototype.putUpdate.name, () => {
    let user: UserDto;
    let noticeBoardId: number;
    let putUpdateNoticeBoardDto: PutUpdateNoticeBoardDto;

    beforeEach(() => {
      user = new UserDto();
      noticeBoardId = NaN;
      putUpdateNoticeBoardDto = new PutUpdateNoticeBoardDto();
    });

    it('put update', async () => {
      mockNoticeBoardsService.putUpdate.mockResolvedValue(new NoticeBoardDto());

      await expect(
        controller.putUpdate(noticeBoardId, user, putUpdateNoticeBoardDto),
      ).resolves.toBeInstanceOf(NoticeBoardDto);
    });
  });
});
