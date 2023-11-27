import { Test, TestingModule } from '@nestjs/testing';
import { ClubListService } from './club-list.service';

describe('ClubListService', () => {
  let service: ClubListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubListService],
    }).compile();

    service = module.get<ClubListService>(ClubListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
