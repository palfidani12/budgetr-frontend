import { useQuery } from '@tanstack/react-query';

export const useLogin = (email: string, password: string): { accessToken: string; userId: string } | undefined | null => {
  const { data } = useQuery({
    queryKey: ['userLogin'],
    queryFn: async () => {
      const res = await fetch('', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();

      return data;
    },
    staleTime: Infinity,
    enabled: true,
  });

  return data;
};
