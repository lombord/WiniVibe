import { type ImageProps, Image } from "@nextui-org/react";
import React from "react";

import styles from "./style.module.css";

interface HeaderImageProps extends ImageProps {
  children?: React.ReactNode;
  bgColor?: string;
}

const HeaderImage: React.FC<HeaderImageProps> = ({
  classNames,
  alt = "user header image",
  bgColor,
  children,
  ...props
}) => {
  return (
    <div
      className={styles.headerBox}
      style={{ "--bg-color": bgColor } as React.CSSProperties}
    >
      <div className={styles.wrapper}>
        <Image
          classNames={{
            img: styles.headerImage,
          }}
          radius="none"
          disableSkeleton
          loading="lazy"
          removeWrapper
          {...props}
          alt={alt}
        />
      </div>
      {children}
    </div>
  );
};

export default HeaderImage;
