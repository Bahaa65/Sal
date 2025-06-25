import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { PaginatedNotifications } from '../types/Notification';

export const useInfiniteNotificationsQuery = () =>
  useInfiniteQuery({
    queryKey: ['notifications-infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get(`/notifications?page=${pageParam}`);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.total_pages) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 2
}); 