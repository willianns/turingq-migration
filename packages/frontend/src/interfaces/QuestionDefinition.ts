import AnswerDefinition from './AnswerDefinition';
import QuestionAuthor from './AuthorDefinition';

/* eslint-disable camelcase */
interface QuestionDefinition {
  id: string;
  title: string;
  author: QuestionAuthor;
  body: string;
  created_at: string;
  updated_at: string;
  views: number;
  answers: AnswerDefinition[];
}

export default QuestionDefinition;
