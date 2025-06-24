import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Use VITE_API_URL to match .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If a 401 is received, the token is invalid or expired.
      // Remove the token and redirect to login.
      localStorage.removeItem('token');
      // This event can be listened to by the AuthContext to update the UI.
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export const voteQuestion = (questionId: number, vote: 0 | 1 | 2) =>
  apiClient.post(`/questions/${questionId}/vote`, { vote });

export const voteAnswer = (answerId: number, vote: 0 | 1 | 2) =>
  apiClient.post(`/answers/${answerId}/vote`, { vote });

export const deleteQuestion = (questionId: number) =>
  apiClient.delete(`/questions/${questionId}`);

export const deleteAnswer = (answerId: number) =>
  apiClient.delete(`/answers/${answerId}`);

export default apiClient; 