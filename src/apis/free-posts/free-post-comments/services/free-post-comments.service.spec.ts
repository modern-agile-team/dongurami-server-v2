import { Test, TestingModule } from '@nestjs/testing';
import { FreePostCommentsService } from './free-post-comments.service';

describe('FreePostCommentsService', () => {
  let service: FreePostCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreePostCommentsService],
    }).compile();

    service = module.get<FreePostCommentsService>(FreePostCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
