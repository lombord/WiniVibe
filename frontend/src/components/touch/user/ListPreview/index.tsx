import { type FC, type ReactNode, memo } from "react";

import styles from "./style.module.css";
import NavButton from "@Base/UI/NavButton";

interface ListPreviewProps {
  title: string;
  href?: string;
  hasMore?: boolean;
  children?: ReactNode;
  className?: string;
}

const ListPreview: FC<ListPreviewProps> = ({
  title,
  href = "",
  hasMore = true,
  children,
  className = "",
}) => {
  return (
    <div className={className}>
      <h2 className="h5 my-2">{title}</h2>
      {children ? (
        <div
          className={`${styles.previewWrapper} ${hasMore ? styles.hasMore : ""}`}
        >
          {children}
          {hasMore && (
            <div className={styles.showBtnWrap}>
              <NavButton
                className={styles.showBtn}
                href={href}
                color="primary"
                disableRipple
                radius="lg"
                size="md"
                variant="flat"
              >
                Show all
              </NavButton>
            </div>
          )}
        </div>
      ) : (
        <h4 className="text-center">Empty</h4>
      )}
      <div></div>
    </div>
  );
};

export default memo(ListPreview) as typeof ListPreview;
