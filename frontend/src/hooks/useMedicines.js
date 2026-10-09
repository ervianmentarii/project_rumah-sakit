import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useMedicines = (params = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['medicines', params],
    queryFn: async () => {
      const { data } = await api.get('/medicines', { params });
      return data;
    }
  });

  const createMedicine = useMutation({
    mutationFn: async (medicineData) => {
      const { data } = await api.post('/medicines', medicineData);
      return data;
    },
    onSuccess: () => {
      toast.success('Medicine created');
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    }
  });

  const updateMedicine = useMutation({
    mutationFn: async ({ id, ...medicineData }) => {
      const { data } = await api.put(`/medicines/${id}`, medicineData);
      return data;
    },
    onSuccess: () => {
      toast.success('Medicine updated');
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    }
  });

  const deleteMedicine = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/medicines/${id}`);
    },
    onSuccess: () => {
      toast.success('Medicine deleted');
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    }
  });

  return {
    ...query,
    createMedicine,
    updateMedicine,
    deleteMedicine
  };
};
