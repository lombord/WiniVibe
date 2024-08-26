import { useMemo, useImperativeHandle, forwardRef } from "react";

import {
  Slider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import PointerDrag from "@Base/window/PointerDrag";
import { useClamp } from "@/hooks/numeric";

import type { CropModalRef } from "./types";

import styles from "./style.module.css";

interface CropModalProps {
  imgURL: string;

  cropWidth: number;
  cropHeight: number;
  cropInvRatio: number;

  visualWidth: number;
  visualHeight: number;

  cropX: number;
  cropY: number;
  cropScale: number;

  minScale: number;
  maxScale: number;

  onCropSave: (cropX: number, cropY: number, cropScale: number) => void;
}

const CropModal = forwardRef<CropModalRef, CropModalProps>(
  (
    {
      imgURL,
      cropWidth,
      cropHeight,
      cropInvRatio,
      visualWidth,
      visualHeight,

      cropX: defCropX,
      cropY: defCropY,
      cropScale: defCropScale,

      minScale,
      maxScale,
      onCropSave,
    },
    ref,
  ) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [cropScale, setCropScale] = useClamp(
      defCropScale,
      minScale,
      maxScale,
    );

    const maxCX = useMemo(
      () => (visualWidth * cropScale - cropWidth) / 2,
      [visualWidth, cropScale, cropWidth],
    );

    const maxCY = useMemo(
      () => (visualHeight * cropScale - cropHeight) / 2,
      [visualHeight, cropScale, cropHeight],
    );

    const [cropX, setCropX] = useClamp(defCropX, -maxCX, maxCX);
    const [cropY, setCropY] = useClamp(defCropY, -maxCY, maxCY);

    useImperativeHandle(ref, () => ({
      openCrop() {
        setCropX(defCropX);
        setCropY(defCropY);
        setCropScale(defCropScale);
        onOpen();
      },
    }));

    const cropBoxStyles = {
      width: cropWidth,
      minHeight: cropHeight / 2,
      "--crop-sx": cropX,
      "--crop-sy": cropY,
      "--crop-scale": cropScale,
      "--crop-inv-ratio": cropInvRatio,
    } as React.CSSProperties;

    const cropImageStyles = {
      backgroundImage: `url(${imgURL})`,
      width: visualWidth,
      height: visualHeight,
    } as React.CSSProperties;

    return (
      <Modal
        backdrop="opaque"
        placement="center"
        classNames={{
          base: "max-w-fit px-3 sm:px-4 md:px-6",
          body: "px-0",
          header: "px-0",
          footer: "px-0",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crop Image
              </ModalHeader>

              <ModalBody>
                <div style={cropBoxStyles} className={`${styles.cropBox}`}>
                  <div className="absolute-full centered-flex h-full w-full">
                    <PointerDrag
                      className={`${styles.cropImage} cursor-grab touch-none active:cursor-grabbing`}
                      onPointerDrag={(xOff: number, yOff: number) => {
                        setCropX(cropX + xOff);
                        setCropY(cropY + yOff);
                      }}
                      style={cropImageStyles}
                    />
                    {minScale != maxScale && (
                      <div className="flex-v-center pointer-events-none absolute inset-x-0 bottom-0 p-4">
                        <Slider
                          size="sm"
                          color="secondary"
                          aria-label="crop-scale-slider"
                          onChange={(value) => setCropScale(value as number)}
                          value={cropScale}
                          className="pointer-events-auto min-w-[80px] max-w-[50%]"
                          minValue={minScale}
                          maxValue={maxScale}
                          step={0.01}
                        />
                      </div>
                    )}
                    {/* <div className={styles.cropGrid}></div> */}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="flex-h-base">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      onCropSave(cropX, cropY, cropScale);
                      onClose();
                    }}
                  >
                    Crop
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  },
);

export default CropModal;
