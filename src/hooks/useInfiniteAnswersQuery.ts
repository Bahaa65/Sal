import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useInfiniteAnswersQuery = (questionId: number) =>
  useInfiniteQuery({
    queryKey: ['answers-infinite', questionId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get(`/questions/${questionId}/answers?page=${pageParam}`);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.total_pages) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  }); 