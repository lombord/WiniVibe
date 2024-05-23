import { type FC } from "react";
import type { NonFieldErrors } from "./types";

import FieldNotes from "../Fields/FieldNotes";

interface SectionErrorsProps {
  errors: NonFieldErrors;
}

const SectionErrors: FC<SectionErrorsProps> = ({ errors }) => {
  return (
    <div className="mb-3">
      {Object.entries(errors).map(([key, error]) => (
        <FieldNotes notes={error} isError key={key} />
      ))}
    </div>
  );
};

export default SectionErrors;
