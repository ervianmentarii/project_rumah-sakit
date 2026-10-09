import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // Replace with actual API call: return api.post('/login', credentials).then(res => res.data);
      // Mocking for now since we have no backend provided:
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: { id: 1, name: 'Admin', role: 'admin', email: credentials.email },
            token: 'mock-token'
          });
        }, 1000);
      });
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success('Login successful');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending
  };
};
