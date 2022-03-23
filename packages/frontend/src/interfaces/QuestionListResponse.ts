import PaginationMetadata from './PaginationMetadata';
import QuestionDefinition from './QuestionDefinition';

interface QuestionListResponse {
  meta: PaginationMetadata;
  data: QuestionDefinition[];
}

export default QuestionListResponse;
