import { useFetchProfile } from "@/hooks/fetch";
import type { ProfileUser } from "@/types/user";
import type { ReactNode, FC } from "react";

type ProfileData = {
  user: ProfileUser;
  profile: ProfileUser["profile"];
  profileColor?: string;
};

interface WrapperProps {
  fallback?: ReactNode;
  children: (data: ProfileData) => ReactNode;
}

const ProfileWrapper: FC<WrapperProps> = ({ fallback, children }) => {
  const { isPending, isError, data: user } = useFetchProfile();

  if (isPending || isError) return fallback || <p>Loading...</p>;

  const { profile } = user;

  const profileColor =
    profile.header_image.extracted_color || profile.photo.extracted_color;

  return children({ user, profile, profileColor });
};

export default ProfileWrapper;
