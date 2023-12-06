import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { FreePostHistory } from '@src/entities/FreePostHistory';

export class CreateFreePostHistoryDto
  implements
    Pick<FreePostHistory, 'title' | 'description' | 'isAnonymous' | 'status'>
{
  title: string;
  description: string;
  isAnonymous: boolean;
  status: FreePostStatus;

  constructor(createFreePostHistoryDto: CreateFreePostHistoryDto) {
    this.title = createFreePostHistoryDto.title;
    this.description = createFreePostHistoryDto.description;
    this.isAnonymous = createFreePostHistoryDto.isAnonymous;
    this.status = createFreePostHistoryDto.status;
  }
}
