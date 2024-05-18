import type { ToastTypes } from "./types";

import { CloseCircle, InfoCircle, MoreCircle, TickCircle } from "iconsax-react";

const ICON_SIZE = "1em";

export const MessageIcons: Record<ToastTypes, JSX.Element> = {
  message: <MoreCircle size={ICON_SIZE} variant="Bold" />,
  error: <CloseCircle size={ICON_SIZE} variant="Bold" />,
  warning: <InfoCircle size={ICON_SIZE} variant="Bold" />,
  info: <InfoCircle size={ICON_SIZE} variant="Bold" />,
  success: <TickCircle size={ICON_SIZE} variant="Bold" />,
};

export const MessageTypes = Object.keys(
  MessageIcons,
) as (keyof typeof MessageIcons)[];
