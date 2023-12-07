import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { Repository } from 'typeorm';

@CustomRepository(FreePostHistory)
export class FreePostHistoryRepository extends Repository<FreePostHistory> {}
