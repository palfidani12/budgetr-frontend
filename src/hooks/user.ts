import { useQuery } from "@tanstack/react-query";
import type { User } from "../types/user-type";

export const useUser = (userId: string | null) => {
  const { data } = useQuery({
    queryKey: [`getUser-${userId}`],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Fetching user failed");
      const data: User = await res.json();

      return data;
    },
    staleTime: Infinity,
    enabled: !!userId,
  });

  return data;
};
