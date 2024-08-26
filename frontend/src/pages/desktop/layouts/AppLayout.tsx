import { Outlet } from "react-router-dom";
import Navigation from "@Desktop/Navigation";

import styles from "./main.module.css";
import Topbar from "@/components/common/Topbar";

export const Component = () => {
  return (
    <div
      className={`${styles.layoutBox}
      flex h-screen gap-2 overflow-hidden 
      p-2 lg:gap-3 lg:p-3`}
    >
      <nav className={styles.navbar}>
        <Navigation />
      </nav>
      <div className="flex-1">
        <div
          className={`${styles.layoutContent} 
          relative mx-[auto] flex h-full min-w-[768px]
          max-w-[1900px] flex-1 flex-col overflow-hidden 
          rounded-xl bg-content3`}
        >
          <header
            className={`${styles.layoutHeader}
            absolute inset-x-0 top-0 z-10 bg-content1/0
            p-4`}
          >
            <Topbar />
          </header>
          <main className="overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Component;
