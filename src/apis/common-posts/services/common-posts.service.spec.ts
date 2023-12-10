import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { COMMON_POST_REPOSITORY_TOKEN } from '@src/apis/common-posts/constants/common-posts.token';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { CommonPostsService } from './common-posts.service';

const mockPostRepository = {
  increment: jest.fn(),
};

describe(CommonPostsService.name, () => {
  let service: CommonPostsService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonPostsService,
        {
          provide: COMMON_POST_REPOSITORY_TOKEN,
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<CommonPostsService<any>>(CommonPostsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(CommonPostsService.prototype.incrementHit.name, () => {
    let postId: number;

    beforeEach(() => {
      postId = NaN;
    });

    it('not found post throw HttpNotFoundException', async () => {
      postId = faker.number.int();

      mockPostRepository.increment.mockResolvedValue({ affected: 0 });

      await expect(service.incrementHit(postId)).rejects.toThrow(
        HttpNotFoundException,
      );
    });

    it('increment hit', async () => {
      postId = faker.number.int();

      mockPostRepository.increment.mockResolvedValue({ affected: 1 });

      await expect(service.incrementHit(postId)).resolves.toBeUndefined();
    });
  });
});
