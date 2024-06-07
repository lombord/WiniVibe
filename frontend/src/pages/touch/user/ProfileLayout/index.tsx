import { memo } from "react";

import { Outlet } from "react-router-dom";
import ProfileWrapper from "@/pages/common/user/ProfileWrapper";
import GradientBox from "@Base/GradientBox";

import styles from "./style.module.css";
import UserAvatar from "@Common/user/UserAvatar";
import ProfileStats from "@Common/user/ProfileStats";
import HeaderImage from "@Common/user/HeaderImage";
import Skeleton from "./Skeleton";

const ProfileLayout = () => {
  return (
    <ProfileWrapper fallback={<Skeleton />}>
      {({ user, profile, profileColor }) => (
        <div className="relative z-10 h-full">
          <GradientBox
            className={`${styles.profileHeaderBase} ${styles.profileHeader}`}
            bgColor={profileColor}
          >
            <HeaderImage
              src={profile.header_image.medium}
              showOverlay={false}
              bgColor="none"
            >
              <div className={styles.avatarBox}>
                <UserAvatar
                  className={styles.profileAvatar}
                  src={profile.photo.medium}
                  bgColor={profile.photo.color}
                />
              </div>
            </HeaderImage>
            <div className={styles.profileInfoBox}>
              <h1 className="text-center h2">{user.username}</h1>
              <ProfileStats
                className={styles.profileStatsBox}
                stats={{
                  followers: { count: user.followers_count, href: "followers" },
                  following: { count: user.following_count, href: "following" },
                  playlists: 50,
                }}
              />
            </div>
          </GradientBox>
          <div className={styles.profileContent}>
            <Outlet />
          </div>
        </div>
      )}
    </ProfileWrapper>
  );
};

export default memo(ProfileLayout);
