import { NavItemsProps } from "./types";
import { Home, MusicLibrary2, SearchNormal1, IconProps } from "iconsax-react";

const iconCommon: IconProps = { size: "30" };
const activeIconCommon: IconProps = { ...iconCommon, variant: "Bold" };

export const navItems: NavItemsProps["items"] = [
  {
    label: "Home",
    to: "/home",
    icon: <Home {...iconCommon} />,
    activeIcon: <Home {...activeIconCommon} />,
  },
  {
    label: "Search",
    to: "/search",
    icon: <SearchNormal1 {...iconCommon} />,
    activeIcon: <SearchNormal1 {...activeIconCommon} />,
  },
  {
    label: "Library",
    to: "/library",
    icon: <MusicLibrary2 {...iconCommon} />,
    activeIcon: <MusicLibrary2 {...activeIconCommon} />,
  },
];
