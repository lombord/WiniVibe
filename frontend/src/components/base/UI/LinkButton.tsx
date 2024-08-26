import React, { FC } from "react";

interface LinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const LinkButton: FC<LinkButtonProps> = ({
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={`transition duration-200 hover:underline 
                  hover:opacity-80 active:scale-95
                  active:opacity-80 
                  ${className}`}
    />
  );
};

export default LinkButton;
