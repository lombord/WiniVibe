import React, { FC } from "react";

import styles from "./style.module.css";

interface SpinnerProps {
  color?: string;
  strokeWidth?: number;
  speed?: number;
  className?: string;
  clockWise?: boolean;
}

const Spinner: FC<SpinnerProps> = ({
  className,
  color = "currentColor",
  strokeWidth = 10,
  speed = 2.75,
  clockWise = true,
}) => {
  strokeWidth = Math.min(strokeWidth, 50);
  const radius = `${50 - strokeWidth / 2}%`;
  const spinnerConf = {
    "--spinner-color": color,
    "--spinner-speed": `${speed}s`,
    "--stroke-width": strokeWidth,
  } as React.CSSProperties;
  return (
    <div
      className={`${styles.spinnerBox} ${className || ""}`}
      style={spinnerConf}
    >
      <svg
        className={`${styles.spinnerSVG} ${clockWise ? styles.clockWise : ""}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 100 100`}
      >
        <defs>
          <mask id="spinnerMask">
            <circle
              className={styles.spinnerStroke}
              cx="50%"
              cy="50%"
              r={radius}
            ></circle>
          </mask>
        </defs>
        <foreignObject
          mask="url(#spinnerMask)"
          className={styles.spinnerForeignObj}
        >
          <div className={styles.spinnerGradient}></div>
        </foreignObject>
      </svg>
    </div>
  );
};

export default Spinner;
