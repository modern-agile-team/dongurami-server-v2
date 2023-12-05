import { FreeBoardStatus } from '@src/apis/free-boards/constants/free-board.enum';
import { FreePostHistory } from '@src/entities/FreePostHistory';

export class CreateFreeBoardHistoryDto
  implements
    Pick<FreePostHistory, 'title' | 'description' | 'isAnonymous' | 'status'>
{
  title: string;
  description: string;
  isAnonymous: boolean;
  status: FreeBoardStatus;

  constructor(createFreeBoardHistoryDto: CreateFreeBoardHistoryDto) {
    this.title = createFreeBoardHistoryDto.title;
    this.description = createFreeBoardHistoryDto.description;
    this.isAnonymous = createFreeBoardHistoryDto.isAnonymous;
    this.status = createFreeBoardHistoryDto.status;
  }
}
