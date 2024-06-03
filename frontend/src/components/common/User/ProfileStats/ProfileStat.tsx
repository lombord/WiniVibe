import type { FC } from "react";

import { ProfileStatProps } from "./type";
import { Link } from "react-router-dom";

import styles from "./style.module.css";

const ProfileStat: FC<ProfileStatProps> = ({ stat, statKey }) => {
  if (typeof stat == "string" || typeof stat == "number") {
    stat = { title: statKey, count: stat };
  }

  const children = (
    <>
      <span className="font-bold">{stat.count || 0}</span>
      <span className={styles.statTitle}>{stat.title || statKey}</span>
    </>
  );

  return (
    <Link className={styles.statBox} to={stat.href || ""}>
      {children}
    </Link>
  );
};

export default ProfileStat;
