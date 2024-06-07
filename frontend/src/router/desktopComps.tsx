import { Suspense, lazy } from "react";

// Non lazy components //
import AppLayout from "@/pages/desktop/layouts/AppLayout";

// Skeletons //
import ProfileLayoutSkeleton from "@/pages/desktop/user/ProfileLayout/Skeleton";
import ProfileSkeleton from "@/pages/desktop/user/ProfilePage/Skeleton";
import ProfileUsersSkeleton from "@/pages/desktop/user/ProfileUsers/Skeleton";

// Lazy components //
const ProfileLayoutLazy = lazy(async () => {
  // await wait(1000);
  return await import("@/pages/desktop/user/ProfileLayout");
});

const ProfileLazy = lazy(async () => {
  // await wait(4000);
  return await import("@/pages/desktop/user/ProfilePage");
});

const ProfileUsers = lazy(() => import("@/pages/desktop/user/ProfileUsers"));

// Suspended components //
export const ProfileLayout = (
  <Suspense fallback={<ProfileLayoutSkeleton />}>
    <ProfileLayoutLazy />
  </Suspense>
);

export const ProfilePage = (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfileLazy />
  </Suspense>
);

export const FollowersPage = (
  <Suspense fallback={<ProfileUsersSkeleton title="Followers" />}>
    <ProfileUsers title="Followers" subPath="followers/" />
  </Suspense>
);

export const FollowingPage = (
  <Suspense fallback={<ProfileUsersSkeleton title="Following" />}>
    <ProfileUsers title="Following" subPath="following/" />
  </Suspense>
);

export { AppLayout };
