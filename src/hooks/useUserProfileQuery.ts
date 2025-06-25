import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useUserProfileQuery = (username: string) =>
  useQuery({
    queryKey: ['user-profile', username],
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${username}`);
      return data.data;
    },
    enabled: !!username,
  }); 