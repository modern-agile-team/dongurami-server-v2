import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
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

  describe(FreePostsController.prototype.remove.name, () => {
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

  describe(FreePostsController.prototype.createComment.name, () => {
    let freePostId: number;
    let user: UserDto;
    let createFreePostCommentDto: CreateFreePostCommentDto;

    beforeEach(() => {
      freePostId = NaN;
      user = new UserDto();
      createFreePostCommentDto = new CreateFreePostDto();
    });

    it('create comment', async () => {
      freePostId = faker.number.int();

      mockFreePostsService.createComment.mockResolvedValue(
        new FreePostCommentDto(),
      );

      await expect(
        controller.createComment(freePostId, user, createFreePostCommentDto),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostsController.prototype.findAllAndCountComment.name, () => {
    let freePostId: number;
    let findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto;

    beforeEach(() => {
      freePostId = NaN;
      findFreePostCommentListQueryDto = new FindFreePostCommentListQueryDto();
    });

    it('pagination free post comment', async () => {
      freePostId = faker.number.int();

      mockFreePostsService.findAllAndCountComment.mockResolvedValue([[], 0]);

      await expect(
        controller.findAllAndCountComment(
          freePostId,
          findFreePostCommentListQueryDto,
        ),
      ).resolves.toEqual([[], 0]);
    });
  });

  describe(FreePostsController.prototype.putUpdateComment.name, () => {
    let user: UserDto;
    let freePostId: number;
    let freePostCommentId: number;
    let putUpdateFreePostCommentDto: PutUpdateFreePostCommentDto;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      freePostCommentId = NaN;
      putUpdateFreePostCommentDto = new PutUpdateFreePostCommentDto();
    });

    it('put update comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostsService.putUpdateComment.mockResolvedValue(
        new FreePostCommentDto(),
      );

      await expect(
        controller.putUpdateComment(
          user,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostsController.prototype.removeComment.name, () => {
    let user: UserDto;
    let freePostId: number;
    let freePostCommentId: number;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      freePostCommentId = NaN;
    });

    it('remove comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostsService.removeComment.mockResolvedValue(1);

      await expect(
        controller.removeComment(user, freePostId, freePostCommentId),
      ).resolves.toBe(1);
    });
  });

  describe(FreePostsController.prototype.createReplyComment.name, () => {
    let freePostId: number;
    let freePostCommentId: number;
    let user: UserDto;
    let createFreePostReplyCommentDto: CreateFreePostReplyCommentDto;

    beforeEach(() => {
      freePostId = NaN;
      freePostCommentId = NaN;
      user = new UserDto();
      createFreePostReplyCommentDto = new CreateFreePostReplyCommentDto();
    });

    it('create reply comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();

      mockFreePostsService.createReplyComment.mockResolvedValue(
        new FreePostReplyCommentDto(),
      );

      await expect(
        controller.createReplyComment(
          user,
          freePostId,
          freePostCommentId,
          createFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
    });
  });

  describe(
    FreePostsController.prototype.findAllAndCountReplyComment.name,
    () => {
      let freePostId: number;
      let freePostCommentId: number;
      let findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto;

      beforeEach(() => {
        freePostId = NaN;
        freePostCommentId = NaN;
        findFreePostReplyCommentListQueryDto =
          new FindFreePostReplyCommentListQueryDto();
      });

      it('pagination free post reply comment', async () => {
        freePostId = faker.number.int();

        mockFreePostsService.findAllAndCountReplyComment.mockResolvedValue([
          [],
          0,
        ]);

        await expect(
          controller.findAllAndCountReplyComment(
            freePostId,
            freePostCommentId,
            findFreePostReplyCommentListQueryDto,
          ),
        ).resolves.toEqual([[], 0]);
      });
    },
  );

  describe(FreePostsController.prototype.putUpdateReplyComment.name, () => {
    let user: UserDto;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;
    let putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      freePostCommentId = NaN;
      freePostReplyCommentId = NaN;
      putUpdateFreePostReplyCommentDto = new PutUpdateFreePostReplyCommentDto();
    });

    it('put update comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();

      mockFreePostsService.putUpdateReplyComment.mockResolvedValue(
        new FreePostReplyCommentDto(),
      );

      await expect(
        controller.putUpdateReplyComment(
          user,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
    });
  });

  describe(FreePostsController.prototype.removeReplyComment.name, () => {
    let user: UserDto;
    let freePostId: number;
    let freePostCommentId: number;
    let freePostReplyCommentId: number;

    beforeEach(() => {
      user = new UserDto();
      freePostId = NaN;
      freePostCommentId = NaN;
      freePostReplyCommentId = NaN;
    });

    it('remove comment', async () => {
      freePostId = faker.number.int();
      freePostCommentId = faker.number.int();
      freePostReplyCommentId = faker.number.int();

      mockFreePostsService.removeReplyComment.mockResolvedValue(1);

      await expect(
        controller.removeReplyComment(
          user,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).resolves.toBe(1);
    });
  });
});
