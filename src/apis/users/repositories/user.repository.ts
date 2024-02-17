import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { User } from '@src/entities/User';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
