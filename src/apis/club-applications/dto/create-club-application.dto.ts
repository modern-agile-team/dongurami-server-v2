import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationAnswersItemRequestDto } from '@src/apis/club-applications/dto/club-application-answers-item-request.dto';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';

export class CreateClubApplicationDto
  implements Pick<ClubApplicationDto, 'clubId' | 'userId' | 'status'>
{
  clubId: string;

  userId: string;

  answers: ClubApplicationAnswersItemRequestDto[];

  status = ClubApplicationStatus.Submit;

  constructor(
    createClubApplicationDto: Partial<CreateClubApplicationDto> = {},
  ) {
    Object.assign(this, createClubApplicationDto);
  }
}
