import { CircularProgress } from "@nextui-org/react";
import type React from "react";

interface CropUploadProps {
  uploading: boolean;
  uploadPercent: number;
  isUploaded: boolean;
}

const CropUpload: React.FC<CropUploadProps> = ({
  uploading,
  uploadPercent,
  isUploaded,
}) => {
  return (
    <div className="centered-flex  absolute inset-0 bg-black/20 text-white">
      <div className="flex-v-center gap-0">
        <CircularProgress
          aria-label="Loading..."
          classNames={{
            svg: "w-24 h-24 md:w-28 md:h-28  drop-shadow-md",
            // indicator: "stroke-white",
            value: "text-xl md:text-2xl font-main font-medium text-white",
          }}
          size="lg"
          value={uploadPercent - +!isUploaded}
          color="secondary"
          showValueLabel={true}
        />
        <h5>{uploading ? "Uploading" : "Uploaded"}</h5>
      </div>
    </div>
  );
};

export default CropUpload;
