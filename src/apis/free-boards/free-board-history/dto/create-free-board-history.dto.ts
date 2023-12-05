import { FreeBoardStatus } from '@src/apis/free-boards/constants/free-board.enum';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';

export class CreateFreeBoardHistoryDto
  implements
    Pick<FreeBoardHistory, 'title' | 'description' | 'isAnonymous' | 'status'>
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
