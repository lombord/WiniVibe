import PreviewSection from "@Common/PreviewSection";
import { UserCards } from "@Common/user/UserCards";
import Skeleton from "./Skeleton";

import { useProfileData } from "@/hooks/fetch";

const ProfilePage = () => {
  const user = useProfileData();

  if (!user) return <Skeleton />;

  return (
    <>
      {user.followers && (
        <PreviewSection title="Followers" href={"followers"}>
          <UserCards isHorizontal users={user.followers} />
        </PreviewSection>
      )}

      {user.following && (
        <PreviewSection title="Following" href={"following"}>
          <UserCards isHorizontal users={user.following} />
        </PreviewSection>
      )}
    </>
  );
};

export default ProfilePage;
