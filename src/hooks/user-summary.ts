import { useQuery } from '@tanstack/react-query';
import { useApi } from './api';
import { useAuth } from './auth';

export const useUserSummary = (from: string, to: string) => {
  const api = useApi();
  const { userId, isLoggedIn } = useAuth();
  const { data } = useQuery({
    queryKey: [`getUserSummary-${userId}`],
    queryFn: async () => {
      const response = await api.userApi.getUserSummary(from, to);

      if (!response.ok) {
        throw new Error('Fetching user summary failed');
      }

      return response.data;
    },
    staleTime: 10000,
    enabled: !!userId && isLoggedIn,
    retry: 1,
  });

  return data;
};
