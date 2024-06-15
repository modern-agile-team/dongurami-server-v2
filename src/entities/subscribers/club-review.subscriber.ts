import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubReview } from '@src/entities/ClubReview';
import { ClubReviewHistory } from '@src/entities/ClubReviewHistory';

@EventSubscriber()
export class ClubReviewSubscriber
  implements EntitySubscriberInterface<ClubReview>
{
  listenTo() {
    return ClubReview;
  }

  async afterInsert(event: InsertEvent<ClubReview>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<ClubReview>): Promise<void> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<ClubReview> | UpdateEvent<ClubReview>,
    action: HistoryAction,
  ): Promise<void> {
    const historyRepository = event.connection.getRepository(ClubReviewHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubReviewId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
