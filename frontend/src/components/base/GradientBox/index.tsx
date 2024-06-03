import type { ReactNode, FC } from "react";

import styles from "./style.module.css";

interface GradientBoxProps {
  children?: ReactNode;
  bgColor?: string;
  className?: string;
  fromColor?: string;
  toColor?: string;
}

const GradientBox: FC<GradientBoxProps> = ({
  children,
  bgColor,
  className = "",
  fromColor,
  toColor,
}) => {
  return (
    <div
      className={`${styles.gradientBox} ${className}`}
      style={
        {
          "--bg-color": bgColor,
          "--from-color": fromColor,
          "--to-color": toColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default GradientBox;
