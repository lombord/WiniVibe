import { Skeleton } from "@nextui-org/react";
import styles from "./style.module.css";
import { Outlet } from "react-router-dom";
import GradientBox from "@/components/base/GradientBox";

const LayoutSkeleton = () => {
  return (
    <div>
      <div>
        <GradientBox
          className={`${styles.profileHeaderBase} ${styles.skeletonProfileHeader} !z-10`}
        >
          <div className={`${styles.avatarBox}`}>
            <Skeleton
              className={`${styles.profileAvatar} skeleton-content2 aspect-square rounded-full`}
            />
          </div>
          <div className={`${styles.profileInfoBox} !relative !z-50`}>
            <Skeleton className="skeleton-content2 mx-auto mt-[70px] h-5 w-[min(60%,_300px)] rounded-full" />
            <div className="mt-2 flex py-2.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-v-base flex-1 items-center gap-2">
                  <Skeleton className="skeleton-content2 h-3 w-[30%] rounded-full shadow-sm" />
                  <Skeleton className="skeleton-content2 h-3 w-[80%] rounded-full shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </GradientBox>
      </div>

      <div className={styles.profileContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutSkeleton;
