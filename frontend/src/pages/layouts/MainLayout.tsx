import { Outlet } from "react-router-dom";
import Navbar from "@/components/Main/Navbar";
import { Button } from "@nextui-org/react";
import { useThemeCtx } from "@/hooks/contexts";

import styles from "./main.module.css";

const AppLayout = () => {
  const { theme, toggleTheme } = useThemeCtx();

  return (
    <div className={`${styles.layoutBox}`}>
      <div className={styles.navbar}>
        <Navbar />
      </div>

      <div className={styles.layoutContent}>
        <div className="text-end">
          <Button onPress={toggleTheme}>{theme}</Button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
