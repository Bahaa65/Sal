export interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  question_id?: number; // ID of the related question for navigation
  answer_id?: number; // ID of the related answer
  user_id?: number; // ID of the user who triggered the notification
  // Additional fields that might be available from API
  data?: {
    question_id?: number;
    answer_id?: number;
    user_id?: number;
    [key: string]: any;
  };
  // Optionally, you can add related user, question, or answer info if your API provides it
  // user?: { id: number; username: string; avatar?: string };
  // question?: { id: number; content: string };
}

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
} 