import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@nextui-org/react";
import { AddCircle, CloseCircle, Crop, Gallery } from "iconsax-react";

import IconButton from "@Base/UI/IconButton";
import { infinityFb, useClamp } from "@/hooks/numeric";

import type { ImageCropSize } from "../types";
import type { CropFunc, CropImageRef, CropModalRef } from "./types";
import CropModal from "./CropModal";

import styles from "./style.module.css";
import type { InputFileWrapOptions } from "../InputFile/types";
import CropUpload from "./CropUpload";

interface CropImageProps extends InputFileWrapOptions {
  removeImage: () => void;
  cropSize?: ImageCropSize;
  image?: File | Blob;
  placeholder?: string;
}

const DEFAULT_WIDTH = 500;
const DEFAULT_HIGHT = 500;

const CropImage = forwardRef<CropImageRef, CropImageProps>(
  (
    {
      triggerSelect,
      removeImage,
      cropSize,
      image,
      placeholder,
      uploading,
      uploadPercent,
      isUploaded,
    },
    ref,
  ) => {
    const cropWidth = useMemo(
      () => (cropSize && cropSize[0]) || DEFAULT_WIDTH,
      [cropSize],
    );
    const cropHeight = useMemo(
      () => (cropSize && cropSize[1]) || DEFAULT_HIGHT,
      [cropSize],
    );
    const cropRatio = useMemo(
      () => infinityFb(cropWidth / cropHeight),
      [cropWidth, cropHeight],
    );
    const cropInvRatio = useMemo(() => infinityFb(1 / cropRatio), [cropRatio]);
    const isLandscape = useMemo(
      () => cropWidth >= cropHeight,
      [cropWidth, cropHeight],
    );

    const imgURL = useMemo(() => image && URL.createObjectURL(image), [image]);
    const imgElmRef = useRef<HTMLImageElement>();

    const [ratioWidth, setRatioWidth] = useState(0);
    const [ratioHeight, setRatioHeight] = useState(0);
    const [visualWidth, setVisualWidth] = useState(0);
    const [visualHeight, setVisualHeight] = useState(0);

    const minScale = useMemo(
      () =>
        Math.max(
          infinityFb((cropWidth * cropHeight) / (visualWidth * visualHeight)),
          1,
        ),
      [cropWidth, cropHeight, visualWidth, visualHeight],
    );

    const maxScale = useMemo(() => {
      const areaRatio =
        Math.floor(
          Math.sqrt((ratioWidth / cropWidth) * (ratioHeight / cropHeight)) * 10,
        ) / 10;
      return Math.max(infinityFb(areaRatio), minScale);
    }, [cropWidth, cropHeight, ratioWidth, ratioHeight, minScale]);

    const [cropScale, setCropScale] = useClamp(1, minScale, maxScale);

    const [cropX, setCropX] = useState(0);
    const [cropY, setCropY] = useState(0);
    const cropRef = useRef<CropModalRef>(null);
    const isCropable = useMemo(() => {
      return maxScale > 1 || cropRatio != visualWidth / visualHeight;
    }, [maxScale, cropRatio, visualWidth, visualHeight]);

    const croppedBlob = useRef<Blob | null>(null);
    const isCropChanged = useRef<boolean>(true);

    const resetCropBlob = useCallback(() => {
      if (!isCropChanged.current) {
        isCropChanged.current = true;
        croppedBlob.current = null;
      }
    }, []);

    useLayoutEffect(() => {
      setCropX(0);
      setCropY(0);
      setCropScale(1, false);
      resetCropBlob();
      if (!imgURL) {
        setRatioWidth(0);
        setRatioHeight(0);
        setVisualWidth(0);
        setVisualHeight(0);
        imgElmRef.current = undefined;
        return;
      }

      const oldImgUrl = imgURL;
      const imgElm = new Image();

      imgElm.onload = () => {
        imgElmRef.current = imgElm;
        const { width, height } = imgElm;
        if (isLandscape) {
          setVisualWidth(cropWidth);
          setVisualHeight(cropWidth * infinityFb(height / width));

          setRatioWidth(width);
          setRatioHeight(width * cropInvRatio);
        } else {
          setVisualWidth(cropHeight * infinityFb(width / height));
          setVisualHeight(cropHeight);

          setRatioWidth(height * cropRatio);
          setRatioHeight(height);
        }
      };
      imgElm.src = oldImgUrl;

      return () => {
        URL.revokeObjectURL(oldImgUrl);
        imgElm.onload = null;
      };
    }, [imgURL]);

    useLayoutEffect(resetCropBlob, [cropX, cropY, cropScale]);

    const getCroppedImage: CropFunc = () => {
      return new Promise((res) => {
        const image = imgElmRef.current;
        if (!(imgURL && image)) return res();
        if (!isCropChanged.current && croppedBlob.current) {
          return res(croppedBlob.current);
        }

        const [sWidth, sHeight] = [
          ratioWidth / cropScale,
          ratioHeight / cropScale,
        ];

        let cSX = -cropX;
        let cSY = -cropY;

        if (cSX) {
          cSX = image.width * infinityFb(cSX / (visualWidth * cropScale));
        }

        if (cSY) {
          cSY = image.height * infinityFb(cSY / (visualHeight * cropScale));
        }

        const sX = (image.width - sWidth) / 2 + cSX;
        const sY = (image.height - sHeight) / 2 + cSY;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        ctx.drawImage(
          image,
          sX,
          sY,
          sWidth,
          sHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        canvas.toBlob(
          (blob) => {
            croppedBlob.current = blob;
            isCropChanged.current = false;
            res(blob);
          },
          "image/jpeg",
          1,
        );
      });
    };

    useImperativeHandle(ref, () => ({ getCroppedImage }));

    const handleCropSave = useCallback(
      (x: number, y: number, scale: number) => {
        setCropX(x);
        setCropY(y);
        setCropScale(scale);
      },
      [],
    );

    const cropBoxStyles = {
      width: cropWidth,
      minHeight: cropHeight / 2,
      "--crop-sx": cropX,
      "--crop-sy": cropY,
      "--crop-scale": cropScale,
      "--crop-inv-ratio": cropInvRatio,
    } as React.CSSProperties;

    const cropImageStyles = {
      backgroundImage: `url(${imgURL || placeholder})`,
      width: visualWidth,
      height: visualHeight,
    } as React.CSSProperties;

    return (
      <div
        style={cropBoxStyles}
        className={`${styles.cropBox} relative mx-auto 
        max-h-full max-w-full overflow-hidden bg-content1 shadow-sm`}
      >
        <div className="absolute-full centered-flex h-full w-full">
          {!imgURL ? (
            <div>
              <Button
                onClick={triggerSelect}
                size="lg"
                variant="solid"
                className="shadow-xl"
                startContent={<Gallery size={32} variant="Bold" />}
              >
                <b>Browse</b>
              </Button>
            </div>
          ) : (
            <>
              <div className={`${styles.cropImage}`} style={cropImageStyles} />
              {isUploaded || uploading ? (
                <CropUpload
                  uploading={uploading}
                  uploadPercent={uploadPercent}
                  isUploaded={isUploaded}
                />
              ) : (
                <div
                  className={`${styles.buttonsBox} flex-h-base pointer-events-none absolute inset-x-0 
                top-0 z-10 items-end justify-between p-4`}
                >
                  <div className="flex-h-base">
                    <IconButton
                      tipContent="Select"
                      onClick={triggerSelect}
                      IconComp={AddCircle}
                    />
                    {isCropable && (
                      <IconButton
                        tipContent="Crop"
                        onClick={() => cropRef.current?.openCrop()}
                        IconComp={Crop}
                      />
                    )}
                  </div>
                  <IconButton
                    tipContent="Remove"
                    onClick={removeImage}
                    IconComp={CloseCircle}
                  />
                </div>
              )}
              <CropModal
                ref={cropRef}
                imgURL={imgURL}
                cropWidth={cropWidth}
                cropHeight={cropHeight}
                cropInvRatio={cropInvRatio}
                visualWidth={visualWidth}
                visualHeight={visualHeight}
                cropX={cropX}
                cropY={cropY}
                cropScale={cropScale}
                minScale={minScale}
                maxScale={maxScale}
                onCropSave={handleCropSave}
              />
            </>
          )}
        </div>
      </div>
    );
  },
);

export default memo(CropImage) as typeof CropImage;
