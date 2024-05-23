import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubPostComment } from '@src/entities/ClubPostComment';
import { ClubPostCommentHistory } from '@src/entities/ClubPostCommentHistory';

@EventSubscriber()
export class ClubPostCommentSubscriber
  implements EntitySubscriberInterface<ClubPostComment>
{
  listenTo() {
    return ClubPostComment;
  }

  async afterInsert(event: InsertEvent<ClubPostComment>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  private async createHistory(
    event: InsertEvent<ClubPostComment> | UpdateEvent<ClubPostComment>,
    action: HistoryAction,
  ): Promise<void> {
    const historyRepository = event.connection.getRepository(
      ClubPostCommentHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubPostCommentId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
