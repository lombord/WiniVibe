import { type FC, type DragEventHandler, useCallback, useRef } from "react";

import styles from "./style.module.css";
import { FolderAdd } from "iconsax-react";
import SelectedFiles from "./SelectedFiles";
import { MultiUploadProps } from "./types";

const MultiUpload: FC<MultiUploadProps> = ({
  files,
  isInvalid = false,
  accept = "Any",
  triggerSelect,
  selectFiles,
  maxFiles,
  ...restProps
}) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback(() => {
    dropRef.current?.classList.add(styles.dropBoxOver);
  }, []);

  const handleDragLeave = useCallback(() => {
    dropRef.current?.classList.remove(styles.dropBoxOver);
  }, []);

  const handleDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    dropRef.current?.classList.remove(styles.dropBoxOver);

    selectFiles(e.dataTransfer.files);
  }, []);

  return (
    <div className="rounded-xl bg-content1 p-3 shadow-sm">
      <div
        ref={dropRef}
        className={`${styles.dropBox} ${isInvalid ? styles.invalidBox : ""}`}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onClick={triggerSelect}
      >
        <div className="h-xl text-secondary flex-v-center">
          <FolderAdd size="1em" variant="Bulk" color="currentColor" />
        </div>
        <p className="truncate font-bold">
          <span className="mr-2">Drag & drop files or</span>
          <span className="text-primary">Browse</span>
        </p>
        <p className="text-tip">Supported types: {accept}</p>
        <p className="text-tip">Max files: {maxFiles}</p>
      </div>
      {files && <SelectedFiles files={files} {...restProps} />}
    </div>
  );
};

export default MultiUpload;
