import { HistoryAction } from '@src/constants/enum';
import { FreePostComment } from '@src/entities/FreePostComment';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class FreePostCommentSubscriber
  implements EntitySubscriberInterface<FreePostComment>
{
  listenTo() {
    return FreePostComment;
  }

  async afterInsert(event: InsertEvent<FreePostComment>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<FreePostComment>): Promise<void> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<FreePostComment> | UpdateEvent<FreePostComment>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(
      FreePostCommentHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      freePostCommentId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
