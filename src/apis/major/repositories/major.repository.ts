import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { UserMajor } from '@src/entities/UserMajor';
import { Repository } from 'typeorm';

@CustomRepository(UserMajor)
export class MajorRepository extends Repository<UserMajor> {}
