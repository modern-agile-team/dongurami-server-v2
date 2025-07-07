import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubApplicationForm } from '@src/entities/ClubApplicationForm';

@CustomRepository(ClubApplicationForm)
export class ClubApplicationFormRepository extends Repository<ClubApplicationForm> {}
