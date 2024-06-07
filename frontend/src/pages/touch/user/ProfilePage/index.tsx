import { useProfileData } from "@/hooks/fetch";
import Skeleton from "./Skeleton";
import UsersList from "@Touch/user/UsersList";

import ListPreview from "@Touch/user/ListPreview";

export const Component = () => {
  const user = useProfileData();

  if (!user) return <Skeleton />;

  return (
    <div>
      <ListPreview
        hasMore={user.followers_count > 5}
        title="Followers"
        href="followers"
      >
        {user.followers && <UsersList users={user.followers.slice(0, 5)} />}
      </ListPreview>
      <ListPreview
        hasMore={user.following_count > 5}
        title="Following"
        href="following"
      >
        {user.following && <UsersList users={user.following.slice(0, 5)} />}
      </ListPreview>
    </div>
  );
};

export default Component;
