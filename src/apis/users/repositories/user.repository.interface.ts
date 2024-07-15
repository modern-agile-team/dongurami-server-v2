import { User } from '@src/apis/users/entities/user.entity';
import { RepositoryPort } from '@src/common/repository.port';

export interface IUserRepository extends RepositoryPort<User> {}
