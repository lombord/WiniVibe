import type { FC } from "react";
import type { NavItemProps } from "./types";

import { NavLink } from "react-router-dom";
import styles from "./style.module.css";

const NavItem: FC<NavItemProps> = ({ label, icon, activeIcon, ...rest }) => {
  return (
    <NavLink
      className={({ isActive }) => {
        let classes = `${styles.navItem}`;
        if (isActive) classes += ` ${styles.activeItem}`;
        return classes;
      }}
      title={label}
      {...rest}
    >
      <div className="flex-h-base items-center gap-1">
        <div className="leading-3">
          <span className={`${styles.defIcon}`}>{icon}</span>
          <span className={`${styles.activeIcon}`}>{activeIcon}</span>
        </div>
        <div className="text-xs font-semibold leading-3">{label}</div>
      </div>
    </NavLink>
  );
};

export default NavItem;
