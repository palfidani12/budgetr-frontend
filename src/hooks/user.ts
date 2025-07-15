import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/user-type";
import { apiClient } from "../utils/api";

export const useUser = (userId: string | null) => {
  const { data } = useQuery({
    queryKey: [`getUser-${userId}`],
    queryFn: async () => {
      const response = await apiClient.get<User>(`/user/${userId}`);
      
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
