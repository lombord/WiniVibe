import { Outlet } from "react-router-dom";
import styles from "./style.module.css";
import { Skeleton } from "@nextui-org/react";

const LayoutSkeleton = () => {
  return (
    <div className={`${styles.profileBox} min-h-[800px]`}>
      <div className={`${styles.headerBox} bg-content1`}>
        <div className={styles.headerContentBox}>
          <Skeleton
            className={`${styles.profileImage} rounded-full bg-content2`}
          />
          <div className="flex flex-col gap-6">
            <Skeleton className="mt-4 h-5 w-24 rounded-full" />
            <Skeleton className="h-20 w-96 rounded-3xl" />
            <Skeleton className="flex h-6 w-48 gap-3 rounded-full"></Skeleton>
          </div>
        </div>
      </div>
      <div className={styles.profileContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutSkeleton;
