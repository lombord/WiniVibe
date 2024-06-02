import { CardsSkeleton } from "@Common/User/UserCards";
import { Skeleton } from "@nextui-org/react";

const ProfileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i}>
          <div className="flex-between py-2">
            <Skeleton className="h-5 w-44 bg-content1 rounded-full" />
            <Skeleton className="h-5 w-32 bg-content1 rounded-full" />
          </div>
          <CardsSkeleton isHorizontal />
        </div>
      ))}
    </>
  );
};

export default ProfileSkeleton;
