import React, { FC } from "react";
import SelectedFile from "./SelectedFile";
import type { SelectedFilesProps } from "./types";

const SelectedFiles: FC<SelectedFilesProps> = ({ files, ...restProps }) => {
  return (
    <div className="flex-v-base mt-4 max-h-[230px] gap-1 overflow-y-auto">
      {files.map((file) => (
        <SelectedFile
          {...restProps}
          key={`${file.type}:${file.name}`}
          file={file}
        />
      ))}
    </div>
  );
};

export default SelectedFiles;
