import { useSessionStore } from "@/stores/sessionStore";
import { useQuery } from "@tanstack/react-query";
import { DetailedUser } from "../types/user";
import { useParams } from "react-router-dom";

export function useLoadSession() {
  const loadSession = useSessionStore.use.loadSession();
  return useQuery({
    queryKey: ["fetchSession"],
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      return await loadSession();
    },
  });
}

export function useFetchProfile() {
  const { username } = useParams();
  const get = useSessionStore.use.get();
  return useQuery({
    queryKey: ["fetchUserProfile"],
    queryFn: async () => {
      const response = await get<DetailedUser>(`/users/${username}/`);
      return response.data;
    },
  });
}
