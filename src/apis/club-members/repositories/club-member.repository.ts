import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubMember } from '@src/entities/ClubMember';

@CustomRepository(ClubMember)
export class ClubMemberRepository extends Repository<ClubMember> {}
