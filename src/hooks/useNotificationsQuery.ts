import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useNotificationsQuery = (page: number = 1) =>
  useQuery({
    queryKey: ['notifications', page],
    queryFn: async () => {
      const { data } = await apiClient.get(`/notifications?page=${page}`);
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  }); 