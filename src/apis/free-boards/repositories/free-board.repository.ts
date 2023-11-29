import { FreeBoard } from '@src/entities/FreeBoard';
import { DataSource, Repository } from 'typeorm';

export class FreeBoardRepository extends Repository<FreeBoard> {
  constructor(private dataSource: DataSource) {
    super(FreeBoard, dataSource.createEntityManager());
  }
}
