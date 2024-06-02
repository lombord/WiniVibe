import { UserCardPages, CardsSkeleton } from "@Common/User/UserCards";
import OffsetFetch from "@Base/OffsetFetch/index";
import type { PublicUser } from "@/types/user";
import { useProfileData } from "@/hooks/fetch";

export const Component = () => {
  const user = useProfileData();

  const fallback = <CardsSkeleton count={25} />;

  return (
    <div>
      <h2 className="h3 mb-4 text-white text-center">Followers</h2>
      {user ? (
        <OffsetFetch<PublicUser>
          endpoint={`users/${user.username}/followers`}
          fallback={fallback}
        >
          {(pages) => <UserCardPages pages={pages} />}
        </OffsetFetch>
      ) : (
        fallback
      )}
    </div>
  );
};

export default Component;
