import HeaderImage from "@Common/User/HeaderImage";
import { Outlet } from "react-router-dom";
import ProfileWrapper from "@/pages/common/user/ProfileWrapper";
import GradientBox from "@Base/GradientBox";

import styles from "./style.module.css";
import UserAvatar from "@Common/User/UserAvatar";
import ProfileStats from "@Common/User/ProfileStats";

const ProfileLayout = () => {
  return (
    <ProfileWrapper fallback={<p>Loading...</p>}>
      {({ user, profile, profileColor }) => (
        <div className="relative z-10 h-full">
          <GradientBox
            className={styles.profileHeader}
            bgColor={profile.photo.color || profileColor}
          >
            <div className="centered-flex flex-col gap-2">
              <UserAvatar
                className="aspect-square h-auto w-[150px]"
                src={profile.photo.medium}
                bgColor={profile.photo.color}
              />
              <h1 className="md:h2">{user.username}</h1>
            </div>
            <ProfileStats
              className="mt-4"
              stats={{
                followers: { count: user.followers_count, href: "followers" },
                following: { count: user.following_count, href: "following" },
                playlists: 50,
              }}
            />
          </GradientBox>
          <div>
            <Outlet />
          </div>
        </div>
      )}
    </ProfileWrapper>
  );
};

export default ProfileLayout;
