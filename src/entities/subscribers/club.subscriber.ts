import { getTsid } from 'tsid-ts';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { Club } from '@src/entities/Club';
import { ClubHistory } from '@src/entities/ClubHistory';

@EventSubscriber()
export class ClubSubscriber implements EntitySubscriberInterface<Club> {
  listenTo() {
    return Club;
  }

  async afterInsert(event: InsertEvent<Club>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  private async createHistory(
    event: InsertEvent<Club> | UpdateEvent<Club>,
    action: HistoryAction,
  ): Promise<void> {
    const historyRepository = event.connection.getRepository(ClubHistory);

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubId: event.entity.id,
      id: getTsid().toBigInt().toString(),
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
