import type { FC } from "react";
import UserAvatar from "@Common/User/UserAvatar";

import styles from "./style.module.css";
import { Link } from "react-router-dom";

interface UserCardProps {
  username: string;
  userImage?: string;
  bgColor?: string;
}

const UserCard: FC<UserCardProps> = ({ username, userImage, bgColor }) => {
  return (
    <div>
      <Link
        tabIndex={-1}
        to={`/user/${username}`}
        className="focus:outline-primary"
      >
        <div className={styles.userCard}>
          <UserAvatar
            className="aspect-square h-auto w-full"
            src={userImage}
            bgColor={bgColor}
          />
          <div>
            <p className="h6 truncate">{username}</p>
            <p className="tip">Profile</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default UserCard;
