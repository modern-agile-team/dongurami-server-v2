import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { FreePostReplyCommentHistory } from '@src/entities/FreePostReplyCommentHistory';

@EventSubscriber()
export class FreePostReplyCommentSubscriber
  implements EntitySubscriberInterface<FreePostReplyComment>
{
  listenTo() {
    return FreePostReplyComment;
  }

  async afterInsert(event: InsertEvent<FreePostReplyComment>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<FreePostReplyComment>): Promise<void> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event:
      | InsertEvent<FreePostReplyComment>
      | UpdateEvent<FreePostReplyComment>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(
      FreePostReplyCommentHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      freePostReplyCommentId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
