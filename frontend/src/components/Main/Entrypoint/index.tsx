import { useLoadSession } from "@/hooks/fetch";
import FullSpinner from "@/components/UI/Spinners/FullSpinner";
import { Suspense, lazy } from "react";

const Dispatcher = lazy(() => import("./Dispatcher"));

const Entrypoint = () => {
  const query = useLoadSession();
  return (
    <>
      {query.isLoading ? (
        <FullSpinner />
      ) : (
        <Suspense fallback={<FullSpinner />}>
          <Dispatcher />
        </Suspense>
      )}
    </>
  );
};

export default Entrypoint;
