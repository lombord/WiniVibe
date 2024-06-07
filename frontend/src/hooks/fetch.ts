import { useSessionStore } from "@/stores/sessionStore";
import {
  QueryKey,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ProfileUser } from "../types/user";
import { useNavigate, useParams } from "react-router-dom";
import { wait } from "@/utils/request";
import { isAxiosError } from "axios";
import { OffsetPagination } from "@/types/fetch";

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

export function useCachedData<T = unknown>(queryKey: QueryKey) {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<T>(queryKey);
}

export type OffsetQueryProps = {
  queryKey?: QueryKey;
  endpoint: string;
  limit?: number;
  initialOffset?: number;
  staleTime?: number;
};

const DEFAULT_STALE = 60e3;

export function useOffsetQuery<T>({
  queryKey,
  endpoint,
  initialOffset = 0,
  limit,
  staleTime = DEFAULT_STALE,
}: OffsetQueryProps) {
  const get = useSessionStore.use.get();
  const query = useInfiniteQuery({
    queryKey: queryKey || [endpoint],
    initialPageParam: initialOffset,
    staleTime,
    queryFn: async ({ pageParam }) => {
      const response = await get<OffsetPagination<T>>(
        `${endpoint}?offset=${pageParam}` + (limit ? `&limit=${limit}` : ""),
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const offset = url.searchParams.get("offset");
        return typeof offset == "string" ? +offset : offset;
      }
    },
    getPreviousPageParam: (lastPage) => {
      if (lastPage.previous) {
        const url = new URL(lastPage.previous);
        const offset = url.searchParams.get("offset");
        return typeof offset == "string" ? +offset : offset;
      }
    },
  });

  return query;
}

export function useFetchProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const get = useSessionStore.use.get();
  return useQuery({
    queryKey: [`fetchProfile:${username}`],
    refetchOnWindowFocus: true,
    staleTime: 60e3,
    queryFn: async () => {
      await wait(2000);
      try {
        const response = await get<ProfileUser>(
          `/users/${username}/?followers_limit=10&following_limit=10`,
        );
        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status == 404) {
            navigate("/404", { replace: true });
          }
        }
        throw error;
      }
    },
  });
}

export function useProfileData() {
  const { username } = useParams();
  const data = useCachedData<ProfileUser>([`fetchProfile:${username}`]);
  return data;
}
