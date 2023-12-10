import { Test, TestingModule } from '@nestjs/testing';
import { REACTION_REPOSITORY_TOKEN } from '@src/apis/reactions/constants/reaction.token';
import { ReactionsService } from './reactions.service';

const mockReactionRepository = {};

describe(ReactionsService.name, () => {
  let service: ReactionsService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionsService,
        {
          provide: REACTION_REPOSITORY_TOKEN,
          useValue: class ReactionRepository {},
        },
      ],
    }).compile();

    service = module.get<ReactionsService<any>>(ReactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
