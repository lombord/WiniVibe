import { useState } from "react";
import Sections from "./Sections";

// styles
import { VoiceSquare } from "iconsax-react";
import { motion } from "framer-motion";
import styles from "./style.module.css";

// conf
import { sections, sidebarVars } from "./conf";
import { Button } from "@nextui-org/react";

const DeskNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={`${styles.sidebar}`}
      layout
      variants={sidebarVars}
    >
      <Button
        onPress={() => setIsOpen(!isOpen)}
        className="aspect-square h-auto w-full shrink-0 rounded-3xl bg-content3"
        isIconOnly
        color="default"
        variant="solid"
      >
        <VoiceSquare
          size={"32"}
          className="text-primary-400"
          variant="Outline"
        />
      </Button>
      <Sections sections={sections} />
    </motion.div>
  );
};

export default DeskNavbar;
