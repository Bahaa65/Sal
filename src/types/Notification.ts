export interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  question_id?: number; // ID of the related question for navigation
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