import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';
import { FindFreePostCommentListQueryDto } from '@src/apis/free-post-comments/dto/find-free-post-comment-list-query.dto';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { PutUpdateFreePostCommentDto } from '@src/apis/free-post-comments/dto/put-update-free-post-comment.dto';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockFreePostCommentsService } from '@test/mock/mock.service';
import { FreePostCommentsService } from '../services/free-post-comments.service';
import { FreePostCommentsController } from './free-post-comments.controller';

describe(FreePostCommentsController.name, () => {
  let controller: FreePostCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreePostCommentsController],
      providers: [
        {
          provide: FreePostCommentsService,
          useValue: mockFreePostCommentsService,
        },
      ],
    }).compile();

    controller = module.get<FreePostCommentsController>(
      FreePostCommentsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(FreePostCommentsController.prototype.create.name, () => {
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

      mockFreePostCommentsService.create.mockResolvedValue(
        new FreePostCommentDto(),
      );

      await expect(
        controller.create(freePostId, user, createFreePostCommentDto),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostCommentsController.prototype.findAllAndCount.name, () => {
    let freePostId: number;
    let findFreePostCommentListQueryDto: FindFreePostCommentListQueryDto;

    beforeEach(() => {
      freePostId = NaN;
      findFreePostCommentListQueryDto = new FindFreePostCommentListQueryDto();
    });

    it('pagination free post comment', async () => {
      freePostId = faker.number.int();

      mockFreePostCommentsService.findAllAndCount.mockResolvedValue([[], 0]);

      await expect(
        controller.findAllAndCount(freePostId, findFreePostCommentListQueryDto),
      ).resolves.toEqual([[], 0]);
    });
  });

  describe(FreePostCommentsController.prototype.putUpdate.name, () => {
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

      mockFreePostCommentsService.putUpdate.mockResolvedValue(
        new FreePostCommentDto(),
      );

      await expect(
        controller.putUpdate(
          user,
          freePostId,
          freePostCommentId,
          putUpdateFreePostCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostCommentDto);
    });
  });

  describe(FreePostCommentsController.prototype.remove.name, () => {
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

      mockFreePostCommentsService.remove.mockResolvedValue(1);

      await expect(
        controller.remove(user, freePostId, freePostCommentId),
      ).resolves.toBe(1);
    });
  });
});
