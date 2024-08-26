export interface CropModalRef {
  openCrop: () => void;
}

export type CropResult = Promise<Blob | void | null>;

export type CropFunc = () => CropResult;

export interface CropImageRef {
  getCroppedImage: CropFunc;
}
