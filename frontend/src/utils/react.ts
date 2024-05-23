import type { ReactNode } from "react";
import { createPortal } from "react-dom";

const TP_CONTAINER_ID = "teleport";

export function rootTeleport(children: ReactNode, key?: null | string) {
  let container = document.body.querySelector(`#${TP_CONTAINER_ID}`);

  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", TP_CONTAINER_ID);
    document.body.appendChild(container);
  }

  return createPortal(children, container, key);
}
