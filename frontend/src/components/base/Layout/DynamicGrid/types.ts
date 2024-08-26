import type { HTMLProps } from "react";

export type GridProp = string | number;

export interface DynamicGridProps extends HTMLProps<HTMLDivElement> {
  minCol?: GridProp;
  minRow?: GridProp;
  maxCol?: GridProp;
  maxRow?: GridProp;
  rowCount?: GridProp;
  colCount?: GridProp;
  autoCols?: GridProp;
  autoRows?: GridProp;
  gap?: GridProp;
  rowGap?: GridProp;
  colGap?: GridProp;
  isHorizontal?: boolean;
  className?: string;
}
