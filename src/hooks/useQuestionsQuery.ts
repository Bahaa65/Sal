import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useQuestionsQuery = (page: number = 1) =>
  useQuery({
    queryKey: ['questions', page],
    queryFn: async () => {
      const { data } = await apiClient.get(`/questions?page=${page}`);
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  }); 