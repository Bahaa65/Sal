import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { Profile } from '../types/Profile';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const { data } = await apiClient.patch('/profile', profile);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}; 