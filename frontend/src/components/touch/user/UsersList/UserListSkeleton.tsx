import { type FC, memo } from "react";

import styles from "./style.module.css";
import { Skeleton } from "@nextui-org/react";

interface UserListSkeletonProps {
  count?: number;
}

const UserListSkeleton: FC<UserListSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className={styles.usersList}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${styles.userItem}`}>
          <Skeleton
            className={`${styles.userItemAvatar} z-10 aspect-square rounded-full after:!bg-content3`}
          />
          <div>
            <Skeleton className="z-10 mb-1.5 h-3 w-44 rounded-full after:!bg-content3" />
            <Skeleton className="z-10 h-2.5 w-24 rounded-full after:!bg-content3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(UserListSkeleton) as typeof UserListSkeleton;
