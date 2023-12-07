import { Test, TestingModule } from '@nestjs/testing';
import { CommonPostsService } from './common-posts.service';

describe('CommonPostsService', () => {
  let service: CommonPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonPostsService],
    }).compile();

    service = module.get<CommonPostsService>(CommonPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
