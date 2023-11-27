import { Test, TestingModule } from '@nestjs/testing';
import { ClubListController } from './club-list.controller';

describe('ClubListController', () => {
  let controller: ClubListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubListController],
    }).compile();

    controller = module.get<ClubListController>(ClubListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
