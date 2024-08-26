import { FC, memo, useMemo } from "react";
import { FileIcons, getFileType } from "./utils";
import { formatBytes } from "@/utils/math";
import { Button } from "@nextui-org/react";
import { CloseCircle } from "iconsax-react";
import type { SelectedFileProps } from "./types";

const SelectedFile: FC<SelectedFileProps> = ({ file, removeFile }) => {
  const IconComponent = useMemo(() => {
    const fType = getFileType(file);
    return FileIcons[fType];
  }, []);

  const fSize = useMemo(() => formatBytes(file.size), []);

  return (
    <div className="flex-h-base rounded-xl border border-foreground/10 bg-content2 p-2 px-3">
      <div className="h4 shrink-0 text-primary">
        <IconComponent size="1em" color="currentColor" variant="Bold" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate font-bold ">{file.name}</p>
        <p className="text-tip-xs font-medium">{fSize}</p>
      </div>
      <div className="shrink-0">
        <Button
          onClick={() => removeFile(file)}
          isIconOnly
          variant="light"
          radius="lg"
          color="danger"
        >
          <CloseCircle variant="Bold" color="currentColor" size="1.5em" />
        </Button>
      </div>
    </div>
  );
};

export default memo(SelectedFile) as typeof SelectedFile;
