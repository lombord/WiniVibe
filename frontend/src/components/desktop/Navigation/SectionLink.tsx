import { NavLink } from "react-router-dom";
import type { SectionLinkProps } from "./types";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import { Tooltip } from "@nextui-org/react";
import { FC } from "react";

const SectionLink: FC<SectionLinkProps> = ({ label, icon, ...rest }) => {
  return (
    <motion.div
      style={{
        translateZ: 0,
      }}
      variants={{
        open: {
          scale: undefined,
        },
        closed: {
          scale: 0,
        },
      }}
    >
      <Tooltip content={label} placement="right" offset={12} delay={150}>
        <NavLink
          className={({ isActive }) => {
            let classes = `${styles.sectionLink}`;
            if (isActive) classes += " activeLink";
            return classes;
          }}
          {...rest}
        >
          {icon}
        </NavLink>
      </Tooltip>
    </motion.div>
  );
};

export default SectionLink;
