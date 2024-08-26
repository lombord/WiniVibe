import ListPages from "@Base/fetch/ListPages";
import { UsersPagePossible } from "@/types/user";
import { type FC } from "react";
import UserItem from "./UserItem";

import styles from "./style.module.css";

interface UsersListProps {
  users: UsersPagePossible;
}

const UsersList: FC<UsersListProps> = ({ users }) => {
  return (
    <div className={styles.usersList}>
      <ListPages pages={users}>
        {(user) => (
          <UserItem
            key={user.id}
            username={user.username}
            bgColor={user.profile.photo.extracted_color}
            userImage={user.profile.photo.small}
          />
        )}
      </ListPages>
    </div>
  );
};

export default UsersList;
