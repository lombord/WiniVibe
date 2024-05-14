import { FC } from "react";
import type { SectionProps } from "./types";
import { keyToLabel } from "@/utils/common";
import SectionLink from "./SectionLink";
import SectionBlock from "./SectionBlock";
import { motion } from "framer-motion";
import { useSessionStore } from "@/stores/sessionStore";

const Section: FC<SectionProps> = ({ links, show = true }) => {
  const user = useSessionStore.use.user();
  if (typeof show === "function") {
    show = show(user);
  }
  return (
    show && (
      <motion.div
        layout
        transition={{ duration: 0.1 }}
        variants={{
          open: {
            transform: undefined,
            opacity: 1,
          },
          closed: {
            scaleX: 0,
            opacity: 0,
            transition: {
              when: "afterChildren",
            },
          },
        }}
      >
        <SectionBlock>
          {Object.entries(links).map(([key, props]) => {
            props.label ||= keyToLabel(key);
            return <SectionLink {...props} key={key} />;
          })}
        </SectionBlock>
      </motion.div>
    )
  );
};

export default Section;
