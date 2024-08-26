import {
  useImperativeHandle,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import type { InputFileProps } from "../types";
import DragDropUpload from "./DragDropUpload";
import {
  type AxiosProgressEvent,
  type AxiosRequestConfig,
  isAxiosError,
} from "axios";
import type {
  InputFileResult,
  RemoveFile,
  SelectFiles,
  InputFilesType,
  InputFileWrapOptions,
} from "./types";
import { useToastStore } from "@/stores/toastStore";
import { useSessionStore } from "@/stores/sessionStore";
import { useStateRef } from "@/hooks/generic";
import { animatePromise } from "@/utils/request";

const DEFAULT_TYPE_ERROR_MSG = "Invalid files were uploaded.";

const InputFile = <
  UC extends AxiosRequestConfig | null = null,
  M extends boolean = false,
  UT extends object = object,
>({
  value,
  setValue,
  widgetRef,
  isRequired,
  isInvalid,
  accept = "*",
  multiple = false as M,
  maxFiles = 1,
  typeErrorMessage = DEFAULT_TYPE_ERROR_MSG,
  filesValidator,
  uploadConfig,
  uploadAs = "files",
  uploadValidator,
  children,
  ...props
}: InputFileProps<UC, M, UT>) => {
  type FT = InputFileResult<M>;
  type RT = Promise<UC extends AxiosRequestConfig ? UT : FT>;

  const request = useSessionStore.use.request();
  const showError = useToastStore.use.showError();
  const showWarning = useToastStore.use.showWarning();

  const [files, setFiles] = [value, setValue];

  const handlingInput = useRef(false);

  const [uploading, setUploading, uploadingRef] = useStateRef(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const uploadResult = useRef<UT>();

  const [errors, setErrors] = useState<string[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptReg = useMemo(() => {
    const mimes = accept.split(/,\s*/);
    const regExps = mimes.map((mime) => new RegExp(mime.replace("*", ".*")));
    return regExps;
  }, []);

  const validateFileTypes = useCallback((files: File[]): boolean => {
    for (const file of files) {
      const isValid = acceptReg.some(
        (reg) =>
          reg.test(file.type) || file.name.toLowerCase().endsWith(reg.source),
      );

      if (!isValid) return false;
    }
    return true;
  }, []);

  const validateFiles = useCallback(
    async (files: File[]): Promise<File[] | void> => {
      if (files.length > maxFiles) {
        throw new Error(`You can't select more than ${maxFiles} files.`);
      }

      if (!validateFileTypes(files)) {
        throw new Error(typeErrorMessage);
      }

      if (filesValidator) {
        files = (await Promise.resolve(filesValidator(files))) as File[];
      }

      return files;
    },
    [],
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrors(null);
      const { files } = e.target;

      let filesList: File[] | null | void = null;
      if (files && files.length) {
        filesList = Array.from(files);
        try {
          filesList = await validateFiles(filesList);
        } catch (error) {
          filesList = null;
          if (error instanceof Error) {
            showError(error.message);
          } else {
            showError("An error occurred while validating files");
          }
        }
      }

      e.target.value = "";
      e.target.files = null;

      if (filesList) {
        setFiles(filesList);
      }
    },
    [],
  );

  const handleInputWrapper = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (handlingInput.current) return;
      handlingInput.current = true;
      try {
        await handleFileInput(e);
      } finally {
        handlingInput.current = false;
      }
    },
    [],
  );

  const selectFiles: SelectFiles = useCallback((files) => {
    const input = inputRef.current;
    if (input) {
      input.files = files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  const triggerSelect = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const removeFile: RemoveFile = useCallback((file) => {
    setFiles((files) => {
      if (files) {
        return files.length > 1 ? files.filter((f) => f != file) : [];
      }
      return files;
    });
  }, []);

  const getUploadData = useCallback((files: InputFilesType) => {
    const data = new FormData();
    for (let i = 0; i < (multiple ? files.length : 1); i++) {
      data.append(uploadAs, files[i]);
    }
    return data;
  }, []);

  const progressHandler = useCallback((event: AxiosProgressEvent) => {
    console.log(event);
    setUploadPercent((event.loaded * 100) / (event.total || 1));
  }, []);

  const uploadFiles = useCallback(async (files?: InputFilesType) => {
    if (uploadResult.current) return uploadResult.current;
    if (uploadingRef.current || !(uploadConfig && files && files.length))
      return;

    const data = getUploadData(files);
    const config = {
      ...uploadConfig,
      baseURL: "/media-api/upload",
      data,
      onUploadProgress: progressHandler,
    } as AxiosRequestConfig;

    try {
      const response = await animatePromise(request<UT>(config), setUploading);
      const responseData = response.data;
      uploadResult.current = responseData;
      return responseData;
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        if (error.response?.status === 500) {
          showWarning("Something went wrong on the server. Please try again.");
        } else {
          showError(error.response?.data?.detail);
        }
      } else {
        showWarning("Something went wrong while uploading files");
      }
      throw new Error("Upload Error");
    }
  }, []);

  const validateUploadFiles = useCallback(async (files?: File[]) => {
    let resultFiles = files as InputFilesType | undefined;

    if (resultFiles && uploadValidator) {
      resultFiles = await Promise.resolve(uploadValidator(resultFiles));
    }

    return resultFiles;
  }, []);

  useImperativeHandle(
    widgetRef,
    () => ({
      async validate() {
        // await new Promise((r) => setTimeout(r, 3e3));
        if (uploadConfig && uploadResult.current) {
          return uploadResult.current as Awaited<RT>;
        }

        const validatedFiles = await validateUploadFiles(files);

        if (!validatedFiles) return;

        if (uploadConfig) {
          return (await uploadFiles(validatedFiles)) as Awaited<RT>;
        }

        return (multiple ? validatedFiles : validatedFiles[0]) as Awaited<RT>;
      },
    }),
    [value],
  );

  const childOptions = {
    removeFile,
    maxFiles,
    accept,
    isInvalid: !!(isInvalid || (errors && errors.length)),
    files,
    selectFiles,
    triggerSelect,
    uploading,
    uploadPercent,
    isUploaded: !!uploadResult.current,
  } as InputFileWrapOptions;

  return (
    <div>
      {children ? children(childOptions) : <DragDropUpload {...childOptions} />}
      <input
        ref={inputRef}
        className="hidden"
        onChange={handleInputWrapper}
        multiple={multiple}
        accept={accept}
        required={isRequired}
        type="file"
        {...props}
      />
      {errors && (
        <div className="flex-v-base mt-2 gap-1">
          {errors.map((error, i) => (
            <p key={i} className="tip-small text-danger">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputFile;
