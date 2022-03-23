/* eslint-disable camelcase */
import AuthorDefinition from './AuthorDefinition';

interface AnswerDefinition {
  id: string;
  author: AuthorDefinition;
  author_id: string;
  question_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export default AnswerDefinition;
