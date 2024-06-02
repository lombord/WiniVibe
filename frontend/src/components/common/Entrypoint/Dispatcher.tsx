import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { Suspense } from "react";
import VPSpinner from "@Base/Spinners/VPSpinner";

const Dispatcher = () => {
  return (
    <Suspense fallback={<VPSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Dispatcher;
