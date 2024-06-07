import { type FC, memo } from "react";
import UserAvatar from "@Common/user/UserAvatar";

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
          <UserAvatar className="w-full" src={userImage} bgColor={bgColor} />
          <div>
            <p className="h6 truncate">{username}</p>
            <p className="tip">Profile</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(UserCard) as typeof UserCard;
