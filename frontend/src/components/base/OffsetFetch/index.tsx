import { memo, useMemo, type ReactNode } from "react";
import type { OffsetPagination } from "@/types/fetch";
import type { IntersectProps } from "@Base/Intersect/types";

import Intersect from "@Base/Intersect";

import { useOffsetQuery, type OffsetQueryProps } from "@/hooks/fetch";

type OffsetFetchProps<T> = OffsetQueryProps & {
  fallback?: ReactNode;
  fetchNext?: boolean;
  fetchPrevious?: boolean;
  children: (pages: OffsetPagination<T>[]) => ReactNode;
};

function OffsetFetch<T>({
  fallback,
  fetchNext = true,
  fetchPrevious = false,
  children,
  ...props
}: OffsetFetchProps<T>) {
  const { data, fetchNextPage, fetchPreviousPage, isFetching, status } =
    useOffsetQuery<T>(props);

  const observerProps = useMemo(() => {
    const props = {} as IntersectProps;
    if (fetchPrevious) {
      props["beforeCB"] = async () => {
        if (isFetching) return;
        const data = await fetchPreviousPage();
        return !data.hasPreviousPage;
      };
    }

    if (fetchNext) {
      props["afterCB"] = async () => {
        if (isFetching) return;
        const data = await fetchNextPage();
        return !data.hasNextPage;
      };
    }

    return props;
  }, [fetchNext, fetchPrevious, isFetching]);

  return (
    <>
      {status == "pending" || status == "error" ? (
        fallback || <div>Loading...</div>
      ) : (
        <Intersect {...observerProps}>{children(data.pages)}</Intersect>
      )}
    </>
  );
}

export default memo(OffsetFetch) as typeof OffsetFetch;
