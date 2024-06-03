export interface ProfileStat {
  title?: string;
  href?: string;
  count?: number | string;
}

export interface ProfileStatProps {
  stat: ProfileStat | string | number;
  statKey: string;
}
