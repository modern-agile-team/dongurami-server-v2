import { Test, TestingModule } from '@nestjs/testing';
import { AdminOptionService } from './admin-option.service';

describe('AdminOptionService', () => {
  let service: AdminOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminOptionService],
    }).compile();

    service = module.get<AdminOptionService>(AdminOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
