import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubApplicationsForm } from '@src/entities/ClubApplicationsForm';
import { ClubApplicationsFormHistory } from '@src/entities/ClubApplicationsFormHistory';

@EventSubscriber()
export class ClubApplicationFormSubscriber
  implements EntitySubscriberInterface<ClubApplicationsForm>
{
  listenTo() {
    return ClubApplicationsForm;
  }

  async afterInsert(event: InsertEvent<ClubApplicationsForm>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  private async createHistory(
    event:
      | InsertEvent<ClubApplicationsForm>
      | UpdateEvent<ClubApplicationsForm>,
    action: HistoryAction,
    userId?: number,
  ) {
    const historyRepository = event.connection.getRepository(
      ClubApplicationsFormHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubApplicationsFormId: event.entity.id,
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
