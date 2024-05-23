import React, { FC } from "react";
import styles from "./style.module.css";

interface SectBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SectionBlock: FC<SectBlockProps> = ({ children, className, ...rest }) => {
  return (
    <div {...rest} className={`${styles.sectionBlock} ${className || ""}`}>
      {children}
    </div>
  );
};

export default SectionBlock;
