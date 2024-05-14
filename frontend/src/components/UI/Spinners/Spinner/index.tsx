import React, { FC } from "react";

import styles from "./style.module.css";

interface SpinnerProps {
  label?: string;
  size?: string;
  speed?: number;
  color?: string;
  wrapperClass?: string;
}

const Spinner: FC<SpinnerProps> = ({
  label,
  size,
  speed,
  color,
  wrapperClass,
}) => {
  const boxStyles = {
    "--spinner-size": size,
    "--spinner-speed": speed,
    "--spinner-color": color,
  } as React.CSSProperties;
  return (
    <div
      className={`${styles.spinnerBox} ${wrapperClass || ""}`}
      style={boxStyles}
    >
      <div className={styles.spinner}></div>
      {label && (
        <p className="text-2xl font-medium text-foreground-700">{label}</p>
      )}
    </div>
  );
};

export default Spinner;
