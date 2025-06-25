import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useInfiniteQuestionsQuery = () =>
  useInfiniteQuery({
    queryKey: ['questions-infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get(`/questions?page=${pageParam}`);
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