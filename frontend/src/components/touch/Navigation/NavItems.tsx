import { FC } from "react";
import type { NavItemsProps } from "./types";
import NavItem from "./NavItem";
import styles from "./style.module.css";

const NavItems: FC<NavItemsProps> = ({ items }) => {
  return (
    <div className={styles.navItems}>
      {items.map((props, idx) => (
        <NavItem {...props} key={idx} />
      ))}
    </div>
  );
};

export default NavItems;
