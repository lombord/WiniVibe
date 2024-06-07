import { Outlet } from "react-router-dom";

import HeaderImage from "@Common/user/HeaderImage";
import UserAvatar from "@Common/user/UserAvatar";
import LayoutSkeleton from "./Skeleton";
import GradientBox from "@Base/GradientBox";
import ProfileWrapper from "@/pages/common/user/ProfileWrapper";
import Link from "@Base/Link";

import styles from "./style.module.css";

export const Component = () => {
  return (
    <ProfileWrapper fallback={<LayoutSkeleton />}>
      {({ user, profile, profileColor }) => (
        <div className={styles.profileBox}>
          <HeaderImage src={profile.header_image.large} bgColor={profileColor}>
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
          <GradientBox
            className={styles.profileGradient}
            bgColor={profileColor}
          />

          <div className={styles.profileContent}>
            <Outlet />
          </div>
        </div>
      )}
    </ProfileWrapper>
  );
};

export default Component;
