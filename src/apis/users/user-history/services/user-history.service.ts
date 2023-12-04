import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserHistoryDto } from '@src/apis/users/user-history/dto/create-user-history.dto';
import { HistoryAction } from '@src/constants/enum';
import { UserHistory } from '@src/entities/UserHistory';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserHistoryService {
  constructor(
    @InjectRepository(UserHistory)
    private readonly userHistoryRepository: Repository<UserHistory>,
  ) {}

  create(
    entityManager: EntityManager,
    userId: number,
    action: HistoryAction,
    createUserHistoryDto: CreateUserHistoryDto,
  ) {
    return entityManager.withRepository(this.userHistoryRepository).save({
      userId,
      action,
      ...new CreateUserHistoryDto(createUserHistoryDto),
    });
  }
}
