import { Outlet } from "react-router-dom";
import Navigation from "@Desktop/Navigation";

import styles from "./main.module.css";
import Topbar from "@/components/common/Topbar";

export const Component = () => {
  return (
    <div className={`${styles.layoutBox}`}>
      <div className={styles.navbar}>
        <Navigation />
      </div>
      <div className="w-full overflow-y-auto">
        <div className={styles.layoutContent}>
          <Topbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Component;
