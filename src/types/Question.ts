export interface Question {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user: {
    id: number;
    username: string;
    full_name?: string;
    avatar?: string;
    first_name: string;
    last_name: string;
    job?: string;
  };
  upvotes: number;
  downvotes: number;
  answers_count?: number;
}

export interface PaginatedQuestions {
  data: Question[];
  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
} 