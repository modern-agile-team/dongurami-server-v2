import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreeBoardDto } from '@src/apis/free-boards/dto/create-free-board.dto';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockFreeBoardsService } from '@test/mock/mock.service';
import { FreeBoardsService } from '../services/free-board.service';
import { FreeBoardsController } from './free-boards.controller';

describe(FreeBoardsController.name, () => {
  let controller: FreeBoardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreeBoardsController],
      providers: [
        {
          provide: FreeBoardsService,
          useValue: mockFreeBoardsService,
        },
      ],
    }).compile();

    controller = module.get<FreeBoardsController>(FreeBoardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(FreeBoardsController.prototype.create.name, () => {
    let user: UserDto;
    let createFreeBoardDto: CreateFreeBoardDto;

    let newFreeBoard: FreeBoardDto;

    beforeEach(() => {
      user = new UserDto();
      createFreeBoardDto = new CreateFreeBoardDto();

      newFreeBoard = new FreeBoardDto();
    });

    it('create free board', async () => {
      user.id = faker.number.int();

      mockFreeBoardsService.create.mockResolvedValue(newFreeBoard);

      await expect(
        controller.create(user, createFreeBoardDto),
      ).resolves.toEqual(newFreeBoard);
    });
  });

  describe(FreeBoardsController.prototype.findAllAndCount.name, () => {
    let findFreeBoardListQueryDto: FindFreeBoardListQueryDto;

    beforeEach(() => {
      findFreeBoardListQueryDto = new FindFreeBoardListQueryDto();
    });

    it('find all and count', async () => {
      mockFreeBoardsService.findAllAndCount.mockResolvedValue([[], 0]);

      await expect(
        controller.findAllAndCount(findFreeBoardListQueryDto),
      ).resolves.toEqual([[], 0]);
    });
  });

  describe(FreeBoardsController.prototype.findAllAndCount.name, () => {
    let user: UserDto;
    let freeBoardId: number;

    beforeEach(() => {
      user = new UserDto();
      freeBoardId = NaN;
    });

    it('remove', async () => {
      user.id = faker.number.int();
      freeBoardId = faker.number.int();

      mockFreeBoardsService.remove.mockResolvedValue(1);

      await expect(controller.remove(user, freeBoardId)).resolves.toBe(1);
    });
  });
});
