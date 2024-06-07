import { memo, useEffect, useState, type FC } from "react";

import type { CommonMsgProps, ToastItem } from "./types";

import { Button } from "@nextui-org/react";
import { MessageIcons } from "./conf";
import { FaXmark } from "react-icons/fa6";

import { Timer } from "@/utils/timer";
import styles from "./style.module.css";

type MessageProps = ToastItem & CommonMsgProps;

const ToastMessage: FC<MessageProps> = ({
  id,
  type = "message",
  title = type,
  message,
  duration,
  removeMessage,
}) => {
  const [timer] = useState(() => new Timer(duration, () => removeMessage(id)));

  useEffect(() => {
    timer.start();
    return () => timer.stop();
  }, []);

  const rootStyle = {
    "--toast-duration": `${duration}ms`,
  } as React.CSSProperties;

  return (
    <div
      onMouseEnter={() => timer.pause()}
      onMouseLeave={() => timer.resume()}
      style={rootStyle}
      className={`${styles.toastMsg} ${type}`}
    >
      <div className={styles.toastMsgBase}>
        <span className={`${styles.msgIcon}`}>{MessageIcons[type]}</span>
        <div className="flex-1">
          <h6 className={styles.msgTitle}>{title}</h6>
          <p className={`${styles.toastMsgContent} text-tip`}>{message}</p>
        </div>
        <div>
          <Button
            onPress={() => removeMessage(id)}
            size="sm"
            isIconOnly
            variant="light"
            radius="full"
            className="text-opacity-70 hover:text-opacity-100"
          >
            <FaXmark size="45%" />
          </Button>
        </div>
      </div>
      <div className={styles.msgProgress}></div>
    </div>
  );
};

export default memo(ToastMessage) as typeof ToastMessage;
