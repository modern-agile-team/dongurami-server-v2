import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { DataSource, Repository } from 'typeorm';

export class FreeBoardHistoryRepository extends Repository<FreeBoardHistory> {
  constructor(private dataSource: DataSource) {
    super(FreeBoardHistory, dataSource.createEntityManager());
  }
}
