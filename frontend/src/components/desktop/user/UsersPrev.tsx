import { useSessionStore } from "@/stores/sessionStore";
import type { OffsetPagination } from "@/types/fetch";
import { PreviewSection, type SectionProps } from "@Common/PreviewSection";
import {
  UserCards,
  UserCardsProps,
  CardSkeleton,
} from "@Common/User/UserCards";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface PreviewProps extends Omit<SectionProps, "children"> {
  fetchURL: string;
  queryPrefix: string;
}

const UsersPrev: FC<PreviewProps> = ({
  fetchURL,
  queryPrefix,
  ...restProps
}) => {
  const get = useSessionStore.use.get();
  const {
    isPending,
    isError,
    data: users,
  } = useQuery({
    queryKey: [`${queryPrefix}Preview`],
    queryFn: async () => {
      const response =
        await get<OffsetPagination<UserCardsProps["users"]>>(fetchURL);
      return response.data.results;
    },
  });

  if (isPending || isError) {
    return <CardSkeleton />;
  }

  return (
    <PreviewSection {...restProps}>
      <UserCards users={users} />
    </PreviewSection>
  );
};

export default UsersPrev;
