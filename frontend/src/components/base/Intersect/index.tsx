import type { FC } from "react";
import type { IntersectProps } from "./types";

import { useIntersection } from "@/hooks/other";
import { Spinner } from "@nextui-org/react";

const Intersect: FC<IntersectProps> = ({
  beforeContent,
  afterContent,
  beforeCB,
  afterCB,
  children,
}) => {
  const beforeRef = useIntersection<HTMLDivElement>(beforeCB);
  const afterRef = useIntersection<HTMLDivElement>(afterCB);

  const fbSpinner = <Spinner size="lg" color="primary" />;

  return (
    <div>
      {beforeCB && (
        <div ref={beforeRef}>
          {beforeContent || (
            <div className="mb-2 flex justify-center">{fbSpinner}</div>
          )}
        </div>
      )}
      {children}
      {afterCB && (
        <div ref={afterRef}>
          {afterContent || (
            <div className="mt-2 flex justify-center">{fbSpinner}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Intersect;
