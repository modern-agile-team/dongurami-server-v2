import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { NoticePost } from '@src/entities/NoticePost';
import { NoticePostHistory } from '@src/entities/NoticePostHistory';

@EventSubscriber()
export class NoticePostSubscriber
  implements EntitySubscriberInterface<NoticePost>
{
  listenTo() {
    return NoticePost;
  }

  async afterInsert(event: InsertEvent<NoticePost>): Promise<any> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<NoticePost>): Promise<any> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<NoticePost> | UpdateEvent<NoticePost>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(NoticePostHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      noticePostId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
