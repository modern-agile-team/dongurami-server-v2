import { QuestionInputType } from '@src/apis/club-application-form/constants/club-application-form.enum';

export interface ClubApplicationFormQuestionItem {
  id: string;
  question: string;
  inputType: QuestionInputType;
  isRequired: boolean;
  allowValues?: string[];
}

export interface ClubApplicationPeriod {
  startsAt: Date | null;
  endsAt: Date | null;
}
