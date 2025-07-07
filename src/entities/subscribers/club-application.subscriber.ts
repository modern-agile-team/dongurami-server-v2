import { getTsid } from 'tsid-ts';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { HistoryAction } from '@src/constants/enum';
import { ClubApplication } from '@src/entities/ClubApplication';
import { ClubApplicationHistory } from '@src/entities/ClubApplicationHistory';

@EventSubscriber()
export class ClubApplicationSubscriber
  implements EntitySubscriberInterface<ClubApplication>
{
  listenTo() {
    return ClubApplication;
  }

  async afterInsert(event: InsertEvent<ClubApplication>): Promise<void> {
    await this.createHistory(event, HistoryAction.Insert);
  }

  async afterUpdate(event: UpdateEvent<ClubApplication>): Promise<void> {
    await this.createHistory(event, HistoryAction.Update);
  }

  private async createHistory(
    event: InsertEvent<ClubApplication> | UpdateEvent<ClubApplication>,
    action: HistoryAction,
  ): Promise<void> {
    const historyRepository = event.connection.getRepository(
      ClubApplicationHistory,
    );

    const newHistory = historyRepository.create({
      ...event.entity,
      action,
      clubApplicationId: event.entity.id,
      id: getTsid().toBigInt().toString(),
      createdAt: undefined,
    });

    await historyRepository.save(newHistory, {
      reload: false,
      listeners: false,
    });
  }
}
