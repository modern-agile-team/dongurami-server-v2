import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubPost } from '@src/entities/ClubPost';
import { ClubPostHistory } from '@src/entities/ClubPostHistory';

@EventSubscriber()
export class ClubPostSubscriber implements EntitySubscriberInterface<ClubPost> {
  listenTo() {
    return ClubPost;
  }

  async afterInsert(event: InsertEvent<ClubPost>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<ClubPost>): Promise<any> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<ClubPost> | UpdateEvent<ClubPost>,
    action: HistoryAction,
  ): Promise<void> {
    const historyRepository = event.connection.getRepository(ClubPostHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubPostId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
