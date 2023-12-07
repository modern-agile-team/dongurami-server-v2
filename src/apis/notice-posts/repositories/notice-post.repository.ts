import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { NoticePost } from '@src/entities/NoticePost';
import { Repository } from 'typeorm';

@CustomRepository(NoticePost)
export class NoticePostRepository extends Repository<NoticePost> {}
