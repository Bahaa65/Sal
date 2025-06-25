export interface Answer {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    job?: string;
  };
  upvotes: number;
  downvotes: number;
  viewer_vote?: boolean | null;
}

export interface PaginatedAnswers {
  data: Answer[];
  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
} 