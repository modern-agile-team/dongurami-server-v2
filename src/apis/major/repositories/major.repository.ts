import { Injectable } from '@nestjs/common';
import { Major } from '@src/entities/Major';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MajorRepository extends Repository<Major> {
  constructor(private dataSource: DataSource) {
    super(Major, dataSource.createEntityManager());
  }
}
