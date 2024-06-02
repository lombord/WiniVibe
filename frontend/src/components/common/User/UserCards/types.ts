import type { PublicUser } from "@/types/user";

export interface UserCardsProps {
  users: PublicUser[];
  isHorizontal?: boolean;
}
