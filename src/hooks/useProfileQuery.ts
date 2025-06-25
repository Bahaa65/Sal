import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { Profile } from '../types/Profile';

export const useProfileQuery = () =>
  useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/profile');
      return data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  }); 