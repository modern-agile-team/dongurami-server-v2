import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubApplication } from '@src/entities/ClubApplication';

@CustomRepository(ClubApplication)
export class ClubApplicationRepository extends Repository<ClubApplication> {}
