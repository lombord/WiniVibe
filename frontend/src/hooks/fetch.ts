import { useSessionStore } from "@/stores/sessionStore";
import { useQuery } from "@tanstack/react-query";

export function useLoadSession() {
  const loadSession = useSessionStore.use.loadSession();
  return useQuery({
    queryKey: ["fetchSession"],
    refetchOnWindowFocus: false,
    retry: false,
    queryFn: async () => {
      // await new Promise((r) => setTimeout(r, 1.5e3));
      return await loadSession();
    },
  });
}
