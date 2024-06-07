import { memo, type FC } from "react";
import type { UserCardsProps } from "./types";

import UserCard from "./UserCard";
import DynamicGrid from "@Base/Layout/DynamicGrid";

import styles from "./style.module.css";
import ListPages from "@Base/ListPages";

const UserCards: FC<UserCardsProps> = ({ users, isHorizontal = false }) => {
  return (
    <DynamicGrid className={styles.userCards} isHorizontal={isHorizontal}>
      <ListPages pages={users}>
        {(user) => (
          <UserCard
            username={user.username}
            key={user.id}
            userImage={user.profile.photo.medium}
            bgColor={user.profile.photo.color}
          />
        )}
      </ListPages>
    </DynamicGrid>
  );
};

export default memo(UserCards) as typeof UserCards;
