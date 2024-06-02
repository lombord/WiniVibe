import React from "react";

import { Outlet } from "react-router-dom";
import HeaderImage from "@/components/common/User/HeaderImage";
import UserAvatar from "@/components/common/User/UserAvatar";
import LayoutSkeleton from "./Skeleton";

import { useFetchProfile } from "@/hooks/fetch";

import styles from "./style.module.css";
import Link from "@Base/Link";

export const Component = () => {
  const { isPending, isError, data: user } = useFetchProfile();

  const fallback = <LayoutSkeleton />;
  if (isPending || isError) return fallback;

  const { profile } = user;

  const profileColor = profile.header_image.color || profile.photo.color;
  return (
    <div className={styles.profileBox}>
      <HeaderImage src={user.profile.header_image.large} bgColor={profileColor}>
        <div className={styles.headerBox}>
          <div className={styles.headerContentBox}>
            <UserAvatar
              bgColor={profile.photo.color}
              className={styles.profileImage}
              src={profile.photo.large}
            />
            <div className={styles.headerInfoBox}>
              <p>Profile</p>
              <h1 className={styles.username}>{user.username}</h1>
              <p className="flex-h-base ml-2 text-white/80">
                <span>
                  <Link
                    className="text-inherit"
                    underline="hover"
                    size="lg"
                    to="followers"
                  >
                    {user.followers_count} followers
                  </Link>
                </span>
                <span>
                  <Link
                    className="text-inherit"
                    underline="hover"
                    size="lg"
                    to="following"
                  >
                    {user.following_count} following
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </HeaderImage>
      <div
        className={styles.profileGradient}
        style={{ "--bg-color": profileColor } as React.CSSProperties}
      ></div>
      <div className={styles.profileContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Component;
