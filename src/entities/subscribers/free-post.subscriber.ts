import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { FreePost } from '@src/entities/FreePost';
import { FreePostHistory } from '@src/entities/FreePostHistory';

@EventSubscriber()
export class FreePostSubscriber implements EntitySubscriberInterface<FreePost> {
  listenTo() {
    return FreePost;
  }

  async afterInsert(event: InsertEvent<FreePost>): Promise<any> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<FreePost>): Promise<any> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<FreePost> | UpdateEvent<FreePost>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(FreePostHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      freePostId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
