import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { FindFreePostListQueryDto } from '@src/apis/free-posts/dto/find-free-post-list-query.dto';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { PatchUpdateFreePostDto } from '@src/apis/free-posts/dto/patch-update-free-post.dto.td';
import { PutUpdateFreePostDto } from '@src/apis/free-posts/dto/put-update-free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockFreePostsService } from '@test/mock/mock.service';
import { FreePostsService } from '../services/free-posts.service';
import { FreePostsController } from './free-posts.controller';

describe(FreePostsController.name, () => {
  let controller: FreePostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreePostsController],
      providers: [
        {
          provide: FreePostsService,
          useValue: mockFreePostsService,
        },
      ],
    }).compile();

    controller = module.get<FreePostsController>(FreePostsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(FreePostsController.prototype.create.name, () => {
    let user: UserDto;
    let createFreePostDto: CreateFreePostDto;

    let newFreePost: FreePostDto;

    beforeEach(() => {
      user = new UserDto();
      createFreePostDto = new CreateFreePostDto();

      newFreePost = new FreePostDto();
    });

    it('create free Post', async () => {
      user.id = faker.number.int();

      mockFreePostsService.create.mockResolvedValue(newFreePost);

      await expect(controller.create(user, createFreePostDto)).resolves.toEqual(
        newFreePost,
      );
    });
  });

  describe(FreePostsController.prototype.findAllAndCount.name, () => {
    let findFreePostListQueryDto: FindFreePostListQueryDto;

    beforeEach(() => {
      findFreePostListQueryDto = new FindFreePostListQueryDto();
    });

    it('find all and count', async () => {
      mockFreePostsService.findAllAndCount.mockResolvedValue([[], 0]);

      await expect(
        controller.findAllAndCount(findFreePostListQueryDto),
      ).resolves.toEqual([[], 0]);
    });
  });

  describe(FreePostsController.prototype.findOneOrNotFound.name, () => {
    let freePostId: number;

    let freePostDto: FreePostDto;

    beforeEach(() => {
      freePostId = NaN;

      freePostDto = new FreePostDto();
    });

    it('findOneFreePost', async () => {
      freePostId = faker.number.int();

      mockFreePostsService.findOneOrNotFound.mockResolvedValue(freePostDto);

      await expect(
        controller.findOneOrNotFound(freePostId),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsController.prototype.putUpdate.name, () => {
    let user: UserDto;
    let freePostId: number;
    let putUpdateFreePostDto: PutUpdateFreePostDto;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      putUpdateFreePostDto = new PutUpdateFreePostDto();
    });

    it('put update', async () => {
      mockFreePostsService.putUpdate.mockResolvedValue(new FreePostDto());

      await expect(
        controller.putUpdate(user, freePostId, putUpdateFreePostDto),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsController.prototype.patchUpdate.name, () => {
    let user: UserDto;
    let freePostId: number;
    let patchUpdateFreePostDto: PatchUpdateFreePostDto;

    let freePostDto: FreePostDto;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      patchUpdateFreePostDto = new PatchUpdateFreePostDto();

      freePostDto = new FreePostDto();
    });

    it('free Post patch update', async () => {
      user.id = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostsService.patchUpdate.mockResolvedValue(freePostDto);

      await expect(
        controller.patchUpdate(user, freePostId, patchUpdateFreePostDto),
      ).resolves.toBeInstanceOf(FreePostDto);
    });
  });

  describe(FreePostsController.prototype.findAllAndCount.name, () => {
    let user: UserDto;
    let freePostId: number;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
    });

    it('remove', async () => {
      user.id = faker.number.int();
      freePostId = faker.number.int();

      mockFreePostsService.remove.mockResolvedValue(1);

      await expect(controller.remove(user, freePostId)).resolves.toBe(1);
    });
  });

  describe(FreePostsController.prototype.incrementHit.name, () => {
    let freePostId: number;

    beforeEach(() => {
      freePostId = NaN;
    });

    it('increment hit', async () => {
      freePostId = faker.number.int();

      mockFreePostsService.incrementHit.mockResolvedValue(undefined);

      await expect(
        controller.incrementHit(freePostId),
      ).resolves.toBeUndefined();
    });
  });
});
