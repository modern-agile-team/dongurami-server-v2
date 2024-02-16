import { HistoryAction } from '@src/constants/enum';
import { User } from '@src/entities/User';
import { UserHistory } from '@src/entities/UserHistory';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async afterInsert(event: InsertEvent<User>): Promise<any> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<User>): Promise<any> {
    let action: HistoryAction;

    if (event.entity.deletedAt) {
      action = HistoryAction.Delete;
    } else {
      action = HistoryAction.Update;
    }

    await this.createHistory(event, action);
  }

  private async createHistory(
    event: InsertEvent<User> | UpdateEvent<User>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(UserHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      userId: event.entity.id,
      id: undefined,
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
