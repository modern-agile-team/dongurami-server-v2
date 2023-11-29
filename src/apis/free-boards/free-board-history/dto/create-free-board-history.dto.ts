import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';

export class CreateFreeBoardHistoryDto
  implements Pick<FreeBoardHistory, 'title' | 'description' | 'isAnonymous'>
{
  title: string;
  description: string;
  isAnonymous: boolean;
}
