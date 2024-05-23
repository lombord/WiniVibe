import { NavLinkProps } from "react-router-dom";

export interface NavItemProps extends NavLinkProps {
  label?: string;
  icon: JSX.Element;
  activeIcon: JSX.Element;
}

export interface NavItemsProps {
  items: NavItemProps[];
}
