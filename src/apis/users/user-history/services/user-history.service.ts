import { Injectable } from '@nestjs/common';
import { CreateUserHistoryDto } from '@src/apis/users/user-history/dto/create-user-history.dto';
import { UserHistoryRepository } from '@src/apis/users/user-history/repositories/user-history.repository';
import { HistoryAction } from '@src/constants/enum';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserHistoryService {
  constructor(private readonly userHistoryRepository: UserHistoryRepository) {}

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
