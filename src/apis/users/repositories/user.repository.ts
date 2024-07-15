import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '@src/apis/users/entities/user.entity';
import { UserMap } from '@src/apis/users/mappers/user.map';
import { BaseRepository } from '@src/common/base.repository';
import { User as UserOrmEntity } from '@src/entities/User';

@Injectable()
export class UserRepository extends BaseRepository<User, UserOrmEntity> {
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
  ) {
    super(repository, UserMap);
  }
}

export const USER_REPOSITORY_TOKEN = Symbol(UserRepository.name);
