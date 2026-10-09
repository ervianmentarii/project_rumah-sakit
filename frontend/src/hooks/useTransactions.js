import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useTransactions = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const { data } = await api.get('/transactions', { params });
      return data;
    }
  });

  const processPayment = useMutation({
    mutationFn: async ({ id, paymentData }) => {
      const { data } = await api.post(`/transactions/${id}/pay`, paymentData);
      return data;
    },
    onSuccess: () => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
    onError: () => toast.error('Payment processing failed')
  });

  return {
    ...query,
    processPayment
  };
};
