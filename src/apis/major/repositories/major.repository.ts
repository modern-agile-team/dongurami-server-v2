import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { Major } from '@src/entities/Major';

@CustomRepository(Major)
export class MajorRepository extends Repository<Major> {}
