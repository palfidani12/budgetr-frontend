import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";
import { useApi } from "./api";

export const useUser = () => {
  const api = useApi();
  const { userId } = useAuth();
  const { data } = useQuery({
    queryKey: [`getUser-${userId}`],
    queryFn: async () => {
      const response = await api.userApi.getUser(userId!);

      if (!response.ok) {
        throw new Error("Fetching user failed");
      }

      return response.data;
    },
    staleTime: Infinity,
    enabled: !!userId,
  });

  return data;
};
