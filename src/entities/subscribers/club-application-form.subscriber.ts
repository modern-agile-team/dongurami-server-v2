import { getTsid } from 'tsid-ts';
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

  async afterUpdate(event: UpdateEvent<ClubApplicationForm>): Promise<void> {
    await this.createHistory(event, HistoryAction.Update);
  }

  private async createHistory(
    event: InsertEvent<ClubApplicationForm> | UpdateEvent<ClubApplicationForm>,
    action: HistoryAction,
  ) {
    const historyRepository = event.connection.getRepository(
      ClubApplicationFormHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubApplicationFormId: event.entity.id,
      id: getTsid().toBigInt().toString(),
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
