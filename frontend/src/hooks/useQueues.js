import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useQueues = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['queues', params],
    queryFn: async () => {
      const { data } = await api.get('/queues', { params });
      return data;
    }
  });

  const createQueue = useMutation({
    mutationFn: async (queueData) => {
      const { data } = await api.post('/queues', queueData);
      return data;
    },
    onSuccess: () => {
      toast.success('Queue created successfully');
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    }
  });

  const updateQueueStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.put(`/queues/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    }
  });

  return {
    ...query,
    createQueue,
    updateQueueStatus
  };
};
