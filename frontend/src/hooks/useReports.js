import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export const useReports = (params = {}) => {
  const query = useQuery({
    queryKey: ['reports', params],
    queryFn: async () => {
      const { data } = await api.get('/reports', { params });
      return data;
    },
    enabled: !!params.startDate && !!params.endDate
  });

  return query;
};
