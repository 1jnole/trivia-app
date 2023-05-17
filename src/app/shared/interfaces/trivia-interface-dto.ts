import { QuestionModel } from './question-model';

export interface TriviaInterfaceDto {
  responseCode: number;
  results: QuestionModel[];
}
