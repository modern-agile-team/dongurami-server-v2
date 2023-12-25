import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/create-free-post-reply-comment.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-post-reply-comments/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/put-update-free-post-reply-comment.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { mockFreePostReplyCommentsService } from '@test/mock/mock.service';
import { FreePostReplyCommentsService } from '../services/free-post-reply-comments.service';
import { FreePostReplyCommentsController } from './free-post-reply-comments.controller';

describe(FreePostReplyCommentsController.name, () => {
  let controller: FreePostReplyCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreePostReplyCommentsController],
      providers: [
        {
          provide: FreePostReplyCommentsService,
          useValue: mockFreePostReplyCommentsService,
        },
      ],
    }).compile();

    controller = module.get<FreePostReplyCommentsController>(
      FreePostReplyCommentsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(FreePostReplyCommentsController.prototype.create.name, () => {
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

      mockFreePostReplyCommentsService.create.mockResolvedValue(
        new FreePostReplyCommentDto(),
      );

      await expect(
        controller.create(
          user,
          freePostId,
          freePostCommentId,
          createFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
    });
  });

  describe(
    FreePostReplyCommentsController.prototype.findAllAndCount.name,
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

        mockFreePostReplyCommentsService.findAllAndCount.mockResolvedValue([
          [],
          0,
        ]);

        await expect(
          controller.findAllAndCount(
            freePostId,
            freePostCommentId,
            findFreePostReplyCommentListQueryDto,
          ),
        ).resolves.toEqual([[], 0]);
      });
    },
  );

  describe(FreePostReplyCommentsController.prototype.putUpdate.name, () => {
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

      mockFreePostReplyCommentsService.putUpdate.mockResolvedValue(
        new FreePostReplyCommentDto(),
      );

      await expect(
        controller.putUpdate(
          user,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
          putUpdateFreePostReplyCommentDto,
        ),
      ).resolves.toBeInstanceOf(FreePostReplyCommentDto);
    });
  });

  describe(FreePostReplyCommentsController.prototype.remove.name, () => {
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

      mockFreePostReplyCommentsService.remove.mockResolvedValue(1);

      await expect(
        controller.remove(
          user,
          freePostId,
          freePostCommentId,
          freePostReplyCommentId,
        ),
      ).resolves.toBe(1);
    });
  });
});
