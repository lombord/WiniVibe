import { UserCards, CardsSkeleton } from "@Common/user/UserCards";
import OffsetFetch from "@Base/fetch/OffsetFetch";
import type { PublicUser } from "@/types/user";
import { useProfileData } from "@/hooks/fetch";
import { type FC, memo } from "react";

interface ProfileUsersProps {
  title: string;
  subPath: string;
}

export const ProfileUsers: FC<ProfileUsersProps> = ({ title, subPath }) => {
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
          {(pages) => <UserCards users={pages} />}
        </OffsetFetch>
      ) : (
        fallback
      )}
    </div>
  );
};

export default memo(ProfileUsers) as typeof ProfileUsers;
