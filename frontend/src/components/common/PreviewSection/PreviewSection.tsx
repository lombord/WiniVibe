import { type FC, memo } from "react";
import type { SectionProps } from "./types";

import { Link } from "react-router-dom";

import styles from "./style.module.css";

const PreviewSection: FC<SectionProps> = ({ title, href, children }) => {
  return (
    <section>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Link className={styles.titleLink} to={href}>
            {title}
          </Link>
        </h2>
        <span>
          <Link className={styles.showAll} to={href}>
            Show all
          </Link>
        </span>
      </div>
      {children}
    </section>
  );
};

export default memo(PreviewSection) as typeof PreviewSection;
