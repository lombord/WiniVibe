import type { PromiseOrValue } from "@/types/utils";

export type RemoveFile = (file: File) => void;

export type SelectFiles = (files: FileList) => void;

export interface SelectedFileProps {
  file: File;
  removeFile: RemoveFile;
}

export type SelectedFilesProps = Omit<SelectedFileProps, "key" | "file"> & {
  files: File[];
};

export type TriggerSelectCB = () => void;

export type InputFileWrapOptions = {
  accept?: string;
  maxFiles: number;
  files?: File[];
  isInvalid?: boolean;
  triggerSelect: () => void;
  selectFiles: SelectFiles;
  removeFile: RemoveFile;
  uploading: boolean;
  uploadPercent: number;
  isUploaded: boolean;
};

export type ChildrenRenderFunc = (options: InputFileWrapOptions) => React.ReactNode;

export type MultiUploadProps = Omit<SelectedFilesProps, "files"> & InputFileWrapOptions;

export type InputFilesType = File[] | Blob[];
export type InputFileType = File | Blob;

export type InputFileResult<M extends boolean> = M extends true
  ? InputFilesType
  : InputFileType;

export type InputFilesValidator = (
  files: File[],
) => PromiseOrValue<File[] | void>;

export type InputUploadValidator = (
  files: InputFilesType,
) => PromiseOrValue<InputFilesType | undefined>;
