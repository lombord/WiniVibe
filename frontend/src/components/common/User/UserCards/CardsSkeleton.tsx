import { Skeleton } from "@nextui-org/react";
import DynamicGrid from "@Base/layout/DynamicGrid";
import { type FC, memo } from "react";

import styles from "./style.module.css";

interface SkeletonProps {
  count?: number;
  isHorizontal?: boolean;
}

const CardsSkeleton: FC<SkeletonProps> = ({
  count = 10,
  isHorizontal = false,
}) => {
  return (
    <DynamicGrid className={styles.userCards} isHorizontal={isHorizontal}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-v-base cursor-pointer rounded-xl
          bg-content1 p-3 pt-5 shadow-sm"
        >
          <Skeleton className="aspect-square w-full rounded-full" />
          <div className="flex-v-base">
            <Skeleton className="h-5 w-10/12 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </DynamicGrid>
  );
};

export default memo(CardsSkeleton) as typeof CardsSkeleton;
