import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserHistoryDto } from '@src/apis/users/user-history/dto/create-user-history.dto';
import { HistoryAction } from '@src/constants/enum';
import { UserHistory } from '@src/entities/UserHistory';
import {
  mockEntityManager,
  mockUserHistoryRepository,
} from '@test/mock/mock.repository';
import { UserHistoryService } from './user-history.service';

describe('UserHistoryService', () => {
  let service: UserHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserHistoryService,
        {
          provide: getRepositoryToken(UserHistory),
          useValue: mockUserHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<UserHistoryService>(UserHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(UserHistoryService.prototype.create.name, () => {
    let entityManager: any;
    let userId: number;
    let action: HistoryAction;
    let createUserHistoryDto: CreateUserHistoryDto;

    beforeEach(() => {
      entityManager = mockEntityManager;
      userId = NaN;
      action = null;
      createUserHistoryDto = new CreateUserHistoryDto({} as any);
    });

    it('create user history', async () => {
      userId = faker.number.int();
      action = HistoryAction.Insert;

      mockUserHistoryRepository.save.mockResolvedValue(createUserHistoryDto);

      await expect(
        service.create(entityManager, userId, action, createUserHistoryDto),
      ).resolves.toEqual({});
    });
  });
});
