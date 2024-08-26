import { Suspense, lazy, memo } from "react";
import VPSpinner from "@Base/UI/Spinners/VPSpinner";

import { useLoadSession } from "@/hooks/fetch";

const Dispatcher = lazy(() => import("./Dispatcher"));

const Entrypoint = () => {
  const query = useLoadSession();
  const fallback = <VPSpinner />;
  return (
    <>
      {query.isLoading ? (
        fallback
      ) : (
        <Suspense fallback={fallback}>
          <Dispatcher />
        </Suspense>
      )}
    </>
  );
};

export default memo(Entrypoint);
