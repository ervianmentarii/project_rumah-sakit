import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useMedicalRecords = (patientId) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['medical-records', patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const { data } = await api.get(`/medical-records/patient/${patientId}`);
      return data;
    },
    enabled: !!patientId
  });

  const createMedicalRecord = useMutation({
    mutationFn: async ({ queueId, recordData }) => {
      // Pass queue_id in body, change URL to /medical-records
      const { data } = await api.post(`/medical-records`, { queue_id: queueId, ...recordData });
      return data;
    },
    onSuccess: () => {
      toast.success('Medical record saved successfully');
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
    onError: () => toast.error('Failed to save medical record')
  });

  return {
    ...query,
    createMedicalRecord
  };
};
