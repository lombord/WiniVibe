import PreviewSection from "@Common/PreviewSection";
import { UserCards } from "@Common/User/UserCards";
import Skeleton from "./Skeleton";

import { useProfileData } from "@/hooks/fetch";

const ProfilePage = () => {
  const user = useProfileData();

  if (!user) return <Skeleton />;

  return (
    <>
      <PreviewSection title="Followers" href={"followers"}>
        {user.followers ? (
          <UserCards isHorizontal users={user.followers} />
        ) : (
          <p>Empty</p>
        )}
      </PreviewSection>
      <PreviewSection title="Following" href={"following"}>
        {user.following ? (
          <UserCards isHorizontal users={user.following} />
        ) : (
          <p>Empty</p>
        )}
      </PreviewSection>
    </>
  );
};

export default ProfilePage;
