import { UserCardPages, CardsSkeleton } from "@Common/User/UserCards";
import OffsetFetch from "@Base/OffsetFetch/index";
import type { PublicUser } from "@/types/user";
import { useProfileData } from "@/hooks/fetch";
import type { FC } from "react";

interface ProfileUsersProps {
  title: string;
  subPath: string;
}

export const Component: FC<ProfileUsersProps> = ({ title, subPath }) => {
  const user = useProfileData();

  const fallback = <CardsSkeleton count={25} />;

  return (
    <div>
      <h2 className="h3 mb-2 text-white">{title}</h2>
      {user ? (
        <OffsetFetch<PublicUser>
          endpoint={`users/${user.username}/${subPath}`}
          fallback={fallback}
        >
          {(pages) => <UserCardPages pages={pages} />}
        </OffsetFetch>
      ) : (
        fallback
      )}
    </div>
  );
};

export default Component;
