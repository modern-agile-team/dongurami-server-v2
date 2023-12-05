import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFreeBoardHistoryDto } from '@src/apis/free-boards/free-board-history/dto/create-free-board-history.dto';
import { HistoryAction } from '@src/constants/enum';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class FreeBoardHistoryService {
  constructor(
    @InjectRepository(FreeBoardHistory)
    private readonly freeBoardHistoryRepository: Repository<FreeBoardHistory>,
  ) {}
  create(
    entityManager: EntityManager,
    userId: number,
    freeBoardId: number,
    action: HistoryAction,
    createFreeBoardHistoryDto: CreateFreeBoardHistoryDto,
  ) {
    return entityManager.withRepository(this.freeBoardHistoryRepository).save({
      userId,
      freeBoardId,
      action,
      ...new CreateFreeBoardHistoryDto(createFreeBoardHistoryDto),
    });
  }
}
