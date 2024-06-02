import type { CSSProperties, FC } from "react";

import { type AvatarProps, Avatar } from "@nextui-org/react";

import styles from "./style.module.css";
import { Profile } from "iconsax-react";

interface UserAvatarProps extends AvatarProps {
  bgColor?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ bgColor, ...props }) => {
  return (
    <Avatar
      loading="lazy"
      classNames={{
        base: `${styles.wrapper} ${bgColor ? styles.avatarColor : ""}`,
        img: styles.avatarImg,
        icon: styles.avatarIcon,
        fallback: styles.avatarFallback,
      }}
      style={
        {
          "--avatar-color": bgColor,
        } as CSSProperties
      }
      showFallback
      fallback={
        <Profile
          className={styles.avatarIcon}
          size="100%"
          color="currentColor"
          variant="Bold"
        />
      }
      {...props}
    />
  );
};

export default UserAvatar;
