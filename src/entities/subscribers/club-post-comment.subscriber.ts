import { getTsid } from 'tsid-ts';
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

  async afterUpdate(event: UpdateEvent<ClubPostComment>): Promise<any> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
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
      id: getTsid().toBigInt().toString(),
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
