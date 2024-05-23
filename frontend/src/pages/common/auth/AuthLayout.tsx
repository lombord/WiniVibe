import { Outlet } from "react-router-dom";

import styles from "./auth.module.css";

export const AuthLayout = () => {
  return (
    <div className={styles.authBox}>
      <div className={styles.authCover}></div>
      <div className={styles.authContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
