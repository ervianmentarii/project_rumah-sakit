import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const usePrescriptions = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['prescriptions', params],
    queryFn: async () => {
      const { data } = await api.get('/prescriptions', { params });
      return data;
    }
  });

  const updatePrescriptionStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/prescriptions/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('Prescription status updated');
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
    }
  });

  return {
    ...query,
    updatePrescriptionStatus
  };
};
