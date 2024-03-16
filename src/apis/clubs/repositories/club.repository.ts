import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { Club } from '@src/entities/Club';

@CustomRepository(Club)
export class ClubRepository extends Repository<Club> {}
