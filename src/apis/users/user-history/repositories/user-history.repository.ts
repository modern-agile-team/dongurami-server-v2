import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { UserHistory } from '@src/entities/UserHistory';
import { Repository } from 'typeorm';

@CustomRepository(UserHistory)
export class UserHistoryRepository extends Repository<UserHistory> {}
