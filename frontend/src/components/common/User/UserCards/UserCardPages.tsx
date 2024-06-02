import DynamicGrid from "@/components/base/Layout/DynamicGrid";
import { OffsetUsers } from "@/types/user";
import { type FC, Fragment } from "react";
import UserCard from "./UserCard";

interface UserPagesProps {
  pages: OffsetUsers[];
}

const UserCardPages: FC<UserPagesProps> = ({ pages }) => {
  return (
    <DynamicGrid minCol="200px" gap="0.5rem">
      {pages.map((page, i) => (
        <Fragment key={i}>
          {page.results.map((user) => (
            <UserCard
              username={user.username}
              key={user.id}
              userImage={user.profile.photo.medium}
              bgColor={user.profile.photo.color}
            />
          ))}
        </Fragment>
      ))}
    </DynamicGrid>
  );
};

export default UserCardPages;
