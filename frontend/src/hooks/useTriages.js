import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useTriages = () => {
  const queryClient = useQueryClient();

  const createTriage = useMutation({
    mutationFn: async ({ queue_id, ...triageData }) => {
      // Backend expects 'queue_id' as part of the payload, and URL is /triages
      const { data } = await api.post(`/triages`, { queue_id, ...triageData });
      return data;
    },
    onSuccess: () => {
      toast.success('Triage saved successfully');
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
    onError: () => toast.error('Failed to save triage')
  });

  return {
    createTriage
  };
};
