import { QuestionInputType } from '@src/apis/club-application-form/constants/club-application-form.enum';

export interface ClubApplicationFormQuestionItem {
  question: string;
  inputType: QuestionInputType;
  isRequired: boolean;
  allowValues?: string[];
}
