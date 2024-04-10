import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubApplicationsForm } from '@src/entities/ClubApplicationsForm';

@CustomRepository(ClubApplicationsForm)
export class ClubApplicationFormRepository extends Repository<ClubApplicationsForm> {}
