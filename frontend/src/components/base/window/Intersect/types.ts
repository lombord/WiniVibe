import type { IntersectCallback } from "@/hooks/other";

export interface IntersectProps {
  beforeContent?: React.ReactElement;
  afterContent?: React.ReactElement;
  beforeCB?: IntersectCallback;
  afterCB?: IntersectCallback;
  children?: React.ReactNode;
}