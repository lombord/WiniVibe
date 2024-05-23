import { useLoadSession } from "@/hooks/fetch";
import VPSpinner from "@/components/common/Spinners/VPSpinner";
import { Suspense, lazy } from "react";

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

export default Entrypoint;
