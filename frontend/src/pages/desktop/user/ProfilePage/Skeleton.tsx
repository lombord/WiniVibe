import { CardsSkeleton } from "@Common/user/UserCards";
import { Skeleton } from "@nextui-org/react";

const ProfileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i}>
          <div className="flex-between py-2">
            <Skeleton className="h-5 w-44 rounded-full bg-content1" />
            <Skeleton className="h-5 w-32 rounded-full bg-content1" />
          </div>
          <CardsSkeleton isHorizontal />
        </div>
      ))}
    </>
  );
};

export default ProfileSkeleton;
