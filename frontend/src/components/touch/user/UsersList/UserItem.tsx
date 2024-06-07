import UserAvatar from "@/components/common/user/UserAvatar";
import { type FC, memo } from "react";

import styles from "./style.module.css";
import { Link } from "react-router-dom";

interface UserItemProps {
  username: string;
  userImage?: string;
  bgColor?: string;
}

const UserItem: FC<UserItemProps> = ({ username, userImage, bgColor }) => {
  return (
    <div>
      <Link to={`/user/${username}`}>
        <div className={styles.userItem}>
          <div>
            <UserAvatar
              src={userImage}
              className={styles.userItemAvatar}
              bgColor={bgColor}
            />
          </div>
          <div className="flex-1">
            <p className="h6">{username}</p>
            <p className="tip">Profile</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(UserItem) as typeof UserItem;
