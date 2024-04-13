import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubApplicationForm } from '@src/entities/ClubApplicationForm';
import { ClubApplicationFormHistory } from '@src/entities/ClubApplicationFormHistory';

@EventSubscriber()
export class ClubApplicationFormSubscriber
  implements EntitySubscriberInterface<ClubApplicationForm>
{
  listenTo() {
    return ClubApplicationForm;
  }

  async afterInsert(event: InsertEvent<ClubApplicationForm>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  private async createHistory(
    event: InsertEvent<ClubApplicationForm> | UpdateEvent<ClubApplicationForm>,
    action: HistoryAction,
    userId?: number,
  ) {
    const historyRepository = event.connection.getRepository(
      ClubApplicationFormHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubApplicationFormId: event.entity.id,
      id: undefined,
      createdAt: undefined,
      userId,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
