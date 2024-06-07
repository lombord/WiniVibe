import UserListSkeleton from "@Touch/user/UsersList/UserListSkeleton";
import { Skeleton } from "@nextui-org/react";

const ProfileSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="skeleton-content2 my-2.5 block h-3.5 w-20 rounded-full" />
          <UserListSkeleton />
        </div>
      ))}
    </div>
  );
};

export default ProfileSkeleton;
