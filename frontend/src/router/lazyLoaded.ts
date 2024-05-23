import useDeviceStore from "@/stores/deviceStore";
import { lazy } from "react";

const isTouch = useDeviceStore.getState().isTouch();

if (isTouch) {
  // touch screen components
  var AppLayout = lazy(() => import("@/pages/touch/layouts/AppLayout"));
  var ProfilePage = lazy(() => import("@/pages/touch/user/ProfilePage"));
} else {
  // desktop components
  var AppLayout = lazy(() => import("@/pages/desktop/layouts/AppLayout"));
  var ProfilePage = lazy(() => import("@/pages/desktop/user/ProfilePage"));
}

export { AppLayout, ProfilePage };
