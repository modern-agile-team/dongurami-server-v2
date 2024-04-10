import { PickType } from '@nestjs/swagger';

import { QuestionInputType } from '@src/apis/club-application-form/constants/club-application-form.enum';
import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { ClubApplicationFormQuestionItem } from '@src/apis/club-application-form/types/club-application-form.type';
import { UserGender } from '@src/apis/users/constants/user.enum';

const COMMON_QUESTION: readonly ClubApplicationFormQuestionItem[] = [
  {
    question: '이름',
    inputType: QuestionInputType.Text,
    isRequired: true,
  },
  {
    question: '학과',
    inputType: QuestionInputType.Text,
    isRequired: true,
  },
  {
    question: '학번',
    inputType: QuestionInputType.Text,
    isRequired: true,
  },
  {
    question: '학년',
    inputType: QuestionInputType.Radio,
    isRequired: true,
    allowValues: ['1', '2', '3', ' 4'],
  },
  {
    question: '성별',
    inputType: QuestionInputType.Radio,
    isRequired: true,
    allowValues: Object.values(UserGender),
  },
  {
    question: '휴대전화',
    inputType: QuestionInputType.Text,
    isRequired: true,
  },
];

export class CreateClubApplicationFormDto extends PickType(
  ClubApplicationFormDto,
  ['commonQuestion', 'customQuestion', 'startsAt', 'endsAt'] as const,
) {
  constructor(
    createClubApplicationFormDto: Partial<
      Omit<CreateClubApplicationFormDto, 'commonQuestion'>
    > = {},
  ) {
    super();

    Object.assign(this, createClubApplicationFormDto);

    this.commonQuestion = [...COMMON_QUESTION];
  }
}
