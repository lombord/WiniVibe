import type { FC } from "react";

import type { ProfileStatProps } from "./type";
import ProfileStat from "./ProfileStat";

import styles from "./style.module.css";

interface ProfileStatsProps {
  stats: Record<string, ProfileStatProps["stat"]>;
  className?: string;
}

const ProfileStats: FC<ProfileStatsProps> = ({ stats, className = "" }) => {
  return (
    <div className={`${styles.statsBox} ${className}`}>
      {Object.entries(stats).map(([key, stat]) => (
        <ProfileStat key={key} stat={stat} statKey={key} />
      ))}
    </div>
  );
};

export default ProfileStats;
