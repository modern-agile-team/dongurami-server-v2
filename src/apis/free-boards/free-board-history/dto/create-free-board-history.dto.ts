import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';

export class CreateFreeBoardHistoryDto
  implements Pick<FreeBoardHistory, 'title' | 'description' | 'isAnonymous'>
{
  title: string;
  description: string;
  isAnonymous: boolean;

  constructor(createFreeBoardHistoryDto: CreateFreeBoardHistoryDto) {
    this.title = createFreeBoardHistoryDto.title;
    this.description = createFreeBoardHistoryDto.description;
    this.isAnonymous = createFreeBoardHistoryDto.isAnonymous;
  }
}
