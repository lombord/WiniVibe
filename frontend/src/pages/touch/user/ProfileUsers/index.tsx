import { UsersList, UserListSkeleton } from "@Touch/user/UsersList";
import OffsetFetch from "@Base/fetch/OffsetFetch";
import type { PublicUser } from "@/types/user";
import { useProfileData } from "@/hooks/fetch";
import { memo, type FC } from "react";

interface ProfileUsersProps {
  title: string;
  subPath: string;
}

export const ProfileUsers: FC<ProfileUsersProps> = ({ title, subPath }) => {
  const user = useProfileData();

  const fallback = <UserListSkeleton count={25} />;

  return (
    <div>
      <h2 className="h4 my-2">{title}</h2>
      {user ? (
        <OffsetFetch<PublicUser>
          endpoint={`users/${user.username}/${subPath}`}
          fallback={fallback}
        >
          {(pages) => <UsersList users={pages} />}
        </OffsetFetch>
      ) : (
        fallback
      )}
    </div>
  );
};

export default memo(ProfileUsers) as typeof ProfileUsers;
