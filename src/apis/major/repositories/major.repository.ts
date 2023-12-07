import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { Major } from '@src/entities/Major';
import { Repository } from 'typeorm';

@CustomRepository(Major)
export class MajorRepository extends Repository<Major> {}
