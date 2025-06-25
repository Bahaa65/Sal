import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useRemoveAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/profile', { avatar: '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}; 