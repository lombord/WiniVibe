import { type FC, type CSSProperties, memo } from "react";
import type { DynamicGridProps } from "./types";

import styles from "./style.module.css";

const DynamicGrid: FC<DynamicGridProps> = ({
  minCol,
  minRow,
  maxCol,
  maxRow,
  colCount,
  rowCount,
  autoCols,
  autoRows,
  gap,
  colGap,
  rowGap,
  isHorizontal = false,
  className = "",
  ...restProps
}) => {
  if (isHorizontal) {
    rowCount = 1;
    autoRows = 0;
    rowGap = 0;
  }

  return (
    <div
      className={`dynamic-grid ${isHorizontal ? styles.horizontalGrid : ""} ${className}`}
      style={
        {
          "--min-col": minCol,
          "--min-row": minRow,
          "--max-col": maxCol,
          "--max-row": maxRow,
          "--col-count": colCount,
          "--row-count": rowCount,
          "--auto-cols": autoCols,
          "--auto-rows": autoRows,
          "--gap": gap,
          "--col-gap": colGap,
          "--row-gap": rowGap,
        } as CSSProperties
      }
      {...restProps}
    />
  );
};

export default memo(DynamicGrid) as typeof DynamicGrid;
