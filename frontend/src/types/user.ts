// User related types

import type { CompressedImage } from "./common";
import { OffsetPagination, PagesPossible } from "./fetch";

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

export type PublicUser = Pick<User, "id" | "username"> & {
  profile: Pick<UserProfile, "photo">;
};

export type ProfileUser = User & {
  followers_count: number;
  following_count: number;
  followers?: PublicUser[];
  following?: PublicUser[];
};

export type OffsetUsers = OffsetPagination<PublicUser>;

export type UsersPagePossible = PagesPossible<PublicUser>;
