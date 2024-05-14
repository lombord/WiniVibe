import {
  ChartSquare,
  Home,
  LogoutCurve,
  MusicPlaylist,
  Profile,
  Radio,
  IconProps,
  LoginCurve,
} from "iconsax-react";

import { SectionsProps } from "./types";
import { Variants } from "framer-motion";

const iconCommon: IconProps = {
  size: "100%",
  variant: "Bold",
};

export const sections: SectionsProps["sections"] = {
  main: {
    links: {
      home: {
        to: "/home",
        icon: <Home {...iconCommon} />,
      },
      playlists: {
        to: "/playlists",
        icon: <MusicPlaylist {...iconCommon} />,
      },
      rooms: {
        to: "/rooms",
        icon: <Radio {...iconCommon} />,
      },
      chart: {
        to: "/chart",
        icon: <ChartSquare {...iconCommon} />,
      },
    },
  },
  user: {
    links: {
      profile: {
        to: "profile/",
        icon: <Profile {...iconCommon} />,
      },
      logout: {
        to: "logout/",
        icon: <LogoutCurve {...iconCommon} />,
      },
    },
    show: (user) => !!user,
  },
  guest: {
    links: {
      login: {
        to: "/auth/login/",
        icon: <LoginCurve {...iconCommon} />,
      },
    },
    show: (user) => !user,
  },
};

export const sidebarVars: Variants = {
  open: {
    position: "relative",
  },
  closed: {
    transition: {
      when: "afterChildren",
    },
    transitionEnd: {
      position: "absolute",
    },
  },
};
