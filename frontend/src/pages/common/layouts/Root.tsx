import { NextUIProvider } from "@nextui-org/react";
import { Outlet, useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <Outlet />
    </NextUIProvider>
  );
};

export default Root;
