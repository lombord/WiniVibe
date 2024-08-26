import { useCallback, useMemo, useRef } from "react";
import type { AxiosRequestConfig } from "axios";

import type { InputImageProps } from "../types";
import InputFile from "../InputFile";

import type { CropImageRef } from "./types";
import CropImage from "./CropImage";

const validateImage = (imgUrl: string) => {
  return new Promise<void>((res, rej) => {
    const imgElm = new Image();
    imgElm.onload = () => {
      res();
    };
    imgElm.onerror = () => {
      rej();
    };
    imgElm.src = imgUrl;
  });
};

const InputImage = <U extends string>({
  value,
  setValue,
  uploadTo,
  cropSize,
  ...restProps
}: InputImageProps<U>) => {
  type UC = U extends "" ? null : { url: U };

  const image = useMemo(() => {
    return value && value[0];
  }, [value]);

  const cropImgRef = useRef<CropImageRef>(null);

  const uploadConfig = useMemo(() => {
    if (!uploadTo) return null;
    return { url: uploadTo, method: "post" } as AxiosRequestConfig;
  }, [uploadTo]);

  const filesValidator = useCallback(async (files: File[]) => {
    let imgURL;
    try {
      imgURL = URL.createObjectURL(files[0]);
      await validateImage(imgURL);
    } catch (error) {
      throw new Error("Invalid image file.");
    } finally {
      imgURL && URL.revokeObjectURL(imgURL);
    }
    return files;
  }, []);

  const uploadValidator = useCallback(async () => {
    const cropped = await cropImgRef.current?.getCroppedImage();
    if (cropped) return [cropped];
  }, []);

  return (
    <InputFile
      {...restProps}
      value={value}
      setValue={setValue}
      accept="image/jpeg, image/png, image/gif"
      typeErrorMessage="Invalid image was uploaded."
      uploadAs="image"
      filesValidator={filesValidator}
      uploadConfig={uploadConfig as UC}
      uploadValidator={uploadValidator}
    >
      {(props) => (
        <CropImage
          {...props}
          ref={cropImgRef}
          removeImage={() => setValue(undefined)}
          cropSize={cropSize}
          image={image}
        />
      )}
    </InputFile>
  );
};

export default InputImage;
