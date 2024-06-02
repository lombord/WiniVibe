import { type FC } from "react";
import type { UserCardsProps } from "./types";

import UserCard from "./UserCard";
import DynamicGrid from "@Base/Layout/DynamicGrid";

const UserCards: FC<UserCardsProps> = ({ users, isHorizontal = false }) => {
  return (
    <DynamicGrid minCol="200px" gap="0.5rem" isHorizontal={isHorizontal}>
      {users.map((user) => (
        <UserCard
          username={user.username}
          key={user.id}
          userImage={user.profile.photo.medium}
          bgColor={user.profile.photo.color}
        />
      ))}
    </DynamicGrid>
  );
};

export default UserCards;
