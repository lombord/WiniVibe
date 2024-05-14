import { RouterProvider } from "react-router-dom";
import router from "@/router";

const Dispatcher = () => {
  return <RouterProvider router={router} />;
};

export default Dispatcher;
