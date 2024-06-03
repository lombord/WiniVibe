import { Suspense, lazy } from "react";
import { wait } from "@/utils/request";

// Non lazy components //
import AppLayout from "@/pages/touch/layouts/AppLayout";

// Skeletons //
import ProfileLayoutSkeleton from "@/pages/touch/user/ProfileLayout/Skeleton";
import ProfileSkeleton from "@/pages/touch/user/ProfilePage/Skeleton";
import ProfileUsersSkeleton from "@/pages/touch/user/ProfileUsers/Skeleton";

// Lazy components //
const ProfileLayoutLazy = lazy(async () => {
  // await wait(1000);
  return await import("@/pages/touch/user/ProfileLayout");
});

const ProfileLazy = lazy(async () => {
  // await wait(4000);
  return await import("@/pages/touch/user/ProfilePage");
});

const ProfileUsers = lazy(() => import("@/pages/touch/user/ProfileUsers"));


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
    <ProfileUsers title="Followers" subPath="followers" />
  </Suspense>
);

export const FollowingPage = (
  <Suspense fallback={<ProfileUsersSkeleton title="Following" />}>
    <ProfileUsers title="Following" subPath="following" />
  </Suspense>
);

export { AppLayout };
