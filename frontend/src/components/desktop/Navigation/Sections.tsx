import { SectionsProps } from "./types";
import Section from "./Section";
import { FC } from "react";

const Sections: FC<SectionsProps> = ({ sections }) => {
  return (
    <>
      {Object.entries(sections).map(([key, props]) => (
        <Section {...props} key={key} />
      ))}
    </>
  );
};

export default Sections;
