import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useAnswersQuery = (questionId: string | number) =>
  useQuery({
    queryKey: ['answers', questionId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/questions/${questionId}/answers`);
      return data.data;
    },
    enabled: !!questionId,
  }); 