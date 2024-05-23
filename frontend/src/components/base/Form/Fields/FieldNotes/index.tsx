import { FC } from "react";

import styles from "./style.module.css";

interface FieldNotesProps {
  notes?: string[] | string;
  isError?: boolean;
}

const FieldNotes: FC<FieldNotesProps> = ({ notes, isError = false }) => {
  if (typeof notes == "string") notes = [notes];
  return (
    notes && (
      <div
        className={`${styles.fieldNotes} ${isError ? styles.fieldErrors : ""}`}
      >
        {notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    )
  );
};

export default FieldNotes;
