import type { IconProps } from "iconsax-react";
import type React from "react";

import { Tooltip } from "@nextui-org/react";

interface IconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  IconComp: React.ComponentType<IconProps>;
  tipContent: string;
}

const IconButton: React.FC<IconButton> = ({
  IconComp,
  tipContent,
  className = "",
  ...props
}) => {
  return (
    <Tooltip content={tipContent}>
      <button
        type="button"
        className={`${className} border border-foreground/10
        relative inline-block aspect-square
        w-9 rounded-full bg-content1/60 text-foreground 
        transition hover:opacity-60 active:scale-95 
        dark:bg-content3/60 md:w-10 lg:w-12`}
        {...props}
      >
        <span className="centered-flex absolute inset-0 z-0">
          <IconComp className="inline-block" variant="Outline" size="60%" color="currentColor" />
        </span>
      </button>
    </Tooltip>
  );
};

export default IconButton;
