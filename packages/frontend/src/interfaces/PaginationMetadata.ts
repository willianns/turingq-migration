/* eslint-disable camelcase */
interface PaginationMetadata {
  current_page: number;
  first_page: number;
  first_page_url: string;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  per_page: number;
  previous_page_url: string | null;
}

export default PaginationMetadata;
