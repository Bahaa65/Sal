import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useQuestionQuery = (id: string | number) =>
  useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/questions/${id}`);
      return data.data;
    },
    enabled: !!id,
  }); 