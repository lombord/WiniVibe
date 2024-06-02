import { lazy } from "react";

import AppLayout from "@/pages/touch/layouts/AppLayout";

export const ProfilePage = lazy(() => import("@/pages/touch/user/ProfilePage"));
export const FollowersPage = lazy(
  () => import("@/pages/touch/user/FollowersPage"),
);

export { AppLayout };
