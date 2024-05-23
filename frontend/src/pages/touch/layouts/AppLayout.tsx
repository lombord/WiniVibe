import { Outlet } from "react-router-dom";
import Navigation from "@Touch/Navigation";

import styles from "./main.module.css";

export const Component = () => {
  return (
    <div className={`${styles.layoutBox}`}>
      <div className={styles.layoutContent}>
        <Outlet />
      </div>
      <div className={styles.navbar}>
        <Navigation />
      </div>
    </div>
  );
};

export default Component;
