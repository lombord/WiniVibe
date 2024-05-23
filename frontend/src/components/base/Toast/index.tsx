import ToastMessages from "./ToastMessages";
import { useToastStore } from "@/stores/toastStore";

import styles from "./style.module.css";

const Toast = () => {
  const messages = useToastStore.use.toasts();
  const removeMessage = useToastStore.use.removeMessage();

  return (
    <div className={styles.toastRoot}>
      <ToastMessages messages={messages} removeMessage={removeMessage} />
    </div>
  );
};

export default Toast;
