// User related types

import type { CompressedImage } from "./common";

export interface UserProfile {
  photo: CompressedImage;
  header_image: CompressedImage;
  city: string;
  country: string;
  bio: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  status: number;
  profile: UserProfile;
}

export type SessionUser = Pick<User, "id" | "username" | "email" | "status"> & {
  profile: Pick<UserProfile, "photo">;
};