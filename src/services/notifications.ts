import apiClient from './apiClient';

export const fetchNotifications = async () => {
  const { data } = await apiClient.get('/notifications');
  return data;
};

export const markNotificationAsRead = async (id: number) => {
  await apiClient.post(`/notifications/${id}/set-read`);
}; 