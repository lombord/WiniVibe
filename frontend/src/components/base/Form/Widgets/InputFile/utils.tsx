import {
  VideoSquare,
  AudioSquare,
  Gallery,
  DocumentText,
  Document,
} from "iconsax-react";
import { FaFilePdf, FaFileZipper } from "react-icons/fa6";

export const FileIcons = {
  image: Gallery,
  audio: AudioSquare,
  video: VideoSquare,
  text: DocumentText,
  zip: FaFileZipper,
  pdf: FaFilePdf,
  default: Document,
};

type FileTypes = keyof typeof FileIcons;

const IMAGE_RE = /^image\//i;
const AUDIO_RE = /^audio\//i;
const VIDEO_RE = /^video\//i;
const TEXT_RE = /^text\//i;
const ZIP_RE = /^application\/(?:.*zip.*|.*rar.*|x-7z-compressed)$/i;
const PDF_RE = /^application\/pdf/;

export function getFileType(file: File): FileTypes {
  const fType = file.type;
  if (IMAGE_RE.test(fType)) return "image";
  if (AUDIO_RE.test(fType)) return "audio";
  if (VIDEO_RE.test(fType)) return "video";
  if (TEXT_RE.test(fType)) return "text";
  if (ZIP_RE.test(fType)) return "zip";
  if (PDF_RE.test(fType)) return "pdf";

  return "default";
}
