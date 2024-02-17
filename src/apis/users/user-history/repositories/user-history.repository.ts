import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { UserHistory } from '@src/entities/UserHistory';

@CustomRepository(UserHistory)
export class UserHistoryRepository extends Repository<UserHistory> {}
