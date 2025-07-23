import { useQuery } from "@tanstack/react-query";
import { useApi } from "./api";
import { useAuth } from "./auth";

export const useUserTransactions = () => {
  const api = useApi();
  const { userId, isLoggedIn } = useAuth();
  const { data } = useQuery({
    queryKey: [`getUserTransactions-${userId}`],
    queryFn: async () => {
      const response = await api.userApi.getUserTransactions();

      if (!response.ok) {
        throw new Error("Fetching user transactions failed");
      }

      return response.data;
    },
    staleTime: Infinity,
    enabled: !!userId && isLoggedIn,
  });

  return data;
};
