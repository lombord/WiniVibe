import { memo, type FC } from "react";
import type { CommonMsgProps, ToastItems } from "./types";

import ToastMessage from "./ToastMessage";

import styles from "./style.module.css";
import { AnimatePresence, motion } from "framer-motion";

type ToastMessagesProps = CommonMsgProps & {
  messages: ToastItems;
};

const animInitial = { x: "150%" };

const animEnter = {
  x: ["100%", "-5%", "2%", "-2%", 0],
  transition: { duration: 0.5 },
};

const animExit = {
  x: [0, "-5%", "150%"],
  transition: { times: [0.8, 0.8], duration: 0.5 },
};

const ToastMessages: FC<ToastMessagesProps> = ({ messages, ...restProps }) => {
  return (
    <div className={styles.toastMessages}>
      <AnimatePresence mode="sync">
        {Array.from(messages.entries()).map(([key, message]) => (
          <motion.div
            initial={animInitial}
            animate={animEnter}
            exit={animExit}
            key={`toast_${key}`}
          >
            <ToastMessage {...restProps} {...message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default memo(ToastMessages) as typeof ToastMessages;
