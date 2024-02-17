import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { mockReactionTypeRepository } from '@test/mock/mock.repository';

import { ReactionType } from '@src/apis/reactions/constants/reaction.enum';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionTypeRepository } from '@src/apis/reactions/repositories/reaction-type.repository';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';

const mockReactionRepository = {
  exist: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe(ReactionsService.name, () => {
  let service: ReactionsService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsService,
        {
          provide: REACTION_REPOSITORY_TOKEN,
          useValue: mockReactionRepository,
        },
        {
          provide: ReactionTypeRepository,
          useValue: mockReactionTypeRepository,
        },
      ],
    }).compile();

    service = module.get<ReactionsService<any>>(ReactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(ReactionsService.prototype.create.name, () => {
    let reactionName: ReactionType;
    let userId: number;
    let parentId: number;

    beforeEach(() => {
      reactionName = null;
      userId = NaN;
      parentId = NaN;
    });

    it('not exist reaction type throw HttpInternalServerException', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(reactionName, userId, parentId),
      ).rejects.toThrow(HttpInternalServerErrorException);
    });

    it('already exist reaction', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue({ id: 1 });
      mockReactionRepository.exist.mockResolvedValue(true);

      await expect(
        service.create(reactionName, userId, parentId),
      ).rejects.toThrow(HttpConflictException);
    });

    it('create like reaction', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue({ id: 1 });
      mockReactionRepository.exist.mockResolvedValue(false);
      mockReactionRepository.save.mockResolvedValue({});

      await expect(
        service.create(reactionName, userId, parentId),
      ).resolves.toBeUndefined();
    });
  });

  describe(ReactionsService.prototype.remove.name, () => {
    let reactionName: ReactionType;
    let userId: number;
    let parentId: number;

    beforeEach(() => {
      reactionName = null;
      userId = NaN;
      parentId = NaN;
    });

    it('not exist reaction type throw HttpInternalServerException', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(reactionName, userId, parentId),
      ).rejects.toThrow(HttpInternalServerErrorException);
    });

    it('not exist reaction', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue({ id: 1 });
      mockReactionRepository.exist.mockResolvedValue(false);

      await expect(
        service.remove(reactionName, userId, parentId),
      ).rejects.toThrow(HttpConflictException);
    });

    it('delete like reaction', async () => {
      reactionName = ReactionType.Like;
      userId = faker.number.int();
      parentId = faker.number.int();

      mockReactionTypeRepository.findOne.mockResolvedValue({ id: 1 });
      mockReactionRepository.exist.mockResolvedValue(true);
      mockReactionRepository.delete.mockResolvedValue({});

      await expect(
        service.remove(reactionName, userId, parentId),
      ).resolves.toBeUndefined();
    });
  });
});
