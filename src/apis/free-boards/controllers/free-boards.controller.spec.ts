import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreeBoardDto } from '@src/apis/free-boards/dto/create-free-board.dto';
import { FindFreeBoardListQueryDto } from '@src/apis/free-boards/dto/find-free-board-list-query.dto';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { PatchUpdateFreeBoardDto } from '@src/apis/free-boards/dto/patch-update-free-board.dto.td';
import { PutUpdateFreeBoardDto } from '@src/apis/free-boards/dto/put-update-free-board.dto';
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

  describe(FreeBoardsController.prototype.findOneOrNotFound.name, () => {
    let freeBoardId: number;

    let freeBoardDto: FreeBoardDto;

    beforeEach(() => {
      freeBoardId = NaN;

      freeBoardDto = new FreeBoardDto();
    });

    it('findOneFreeBoard', async () => {
      freeBoardId = faker.number.int();

      mockFreeBoardsService.findOneOrNotFound.mockResolvedValue(freeBoardDto);

      await expect(
        controller.findOneOrNotFound(freeBoardId),
      ).resolves.toBeInstanceOf(FreeBoardDto);
    });
  });

  describe(FreeBoardsController.prototype.putUpdate.name, () => {
    let user: UserDto;
    let freeBoardId: number;
    let putUpdateFreeBoardDto: PutUpdateFreeBoardDto;

    beforeEach(() => {
      user = new UserDto();
      freeBoardId = NaN;
      putUpdateFreeBoardDto = new PutUpdateFreeBoardDto();
    });

    it('put update', async () => {
      mockFreeBoardsService.putUpdate.mockResolvedValue(new FreeBoardDto());

      await expect(
        controller.putUpdate(user, freeBoardId, putUpdateFreeBoardDto),
      ).resolves.toBeInstanceOf(FreeBoardDto);
    });
  });

  describe(FreeBoardsController.prototype.patchUpdate.name, () => {
    let user: UserDto;
    let freeBoardId: number;
    let patchUpdateFreeBoardDto: PatchUpdateFreeBoardDto;

    let freeBoardDto: FreeBoardDto;

    beforeEach(() => {
      user = new UserDto();
      freeBoardId = NaN;
      patchUpdateFreeBoardDto = new PatchUpdateFreeBoardDto();

      freeBoardDto = new FreeBoardDto();
    });

    it('free board patch update', async () => {
      user.id = faker.number.int();
      freeBoardId = faker.number.int();

      mockFreeBoardsService.patchUpdate.mockResolvedValue(freeBoardDto);

      await expect(
        controller.patchUpdate(user, freeBoardId, patchUpdateFreeBoardDto),
      ).resolves.toBeInstanceOf(FreeBoardDto);
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
