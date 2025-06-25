import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useUserQuestionsQuery = (username: string, page: number = 1) =>
  useQuery({
    queryKey: ['user-questions', username, page],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${username}/questions?page=${page}`);
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!username,
  }); 