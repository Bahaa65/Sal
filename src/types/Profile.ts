export interface Profile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  avatar?: string;
  job?: string;
  bio?: string;
  questions?: {
    id: number;
    content: string;
    created_at: string;
  }[];
} 