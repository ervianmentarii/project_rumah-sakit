import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const usePatients = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const { data } = await api.get('/patients', { params });
      return data;
    }
  });

  const createPatient = useMutation({
    mutationFn: async (newPatient) => {
      const { data } = await api.post('/patients', newPatient);
      return data;
    },
    onSuccess: () => {
      toast.success('Patient registered successfully');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to register patient';
      toast.error(msg);
    }
  });

  return {
    ...query,
    createPatient
  };
};
