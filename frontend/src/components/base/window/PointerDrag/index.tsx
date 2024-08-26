import type React from "react";
import { memo, useCallback, useRef } from "react";

interface PointerDragBaseProps {
  onPointerDrag: (xOffset: number, yOffset: number) => void;
}

type PointerDragProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | keyof PointerDragBaseProps
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerOut"
> &
  PointerDragBaseProps;

const PointerDrag: React.FC<PointerDragProps> = ({
  onPointerDrag,
  ...props
}) => {
  const prevX = useRef(0);
  const prevY = useRef(0);
  const grabbing = useRef(false);

  const handleMoveStart: React.PointerEventHandler<HTMLDivElement> =
    useCallback((e) => {
      grabbing.current = true;
      prevX.current = e.clientX;
      prevY.current = e.clientY;
    }, []);

  const handleMove: React.PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (grabbing.current) {
        // e.stopPropagation();
        onPointerDrag(e.clientX - prevX.current, e.clientY - prevY.current);
        prevX.current = e.clientX;
        prevY.current = e.clientY;
      }
    },
    [onPointerDrag],
  );

  const handleMoveEnd = useCallback(() => {
    if (!grabbing.current) return;
    grabbing.current = false;
  }, []);

  return (
    <div
      {...props}
      onPointerDown={handleMoveStart}
      onPointerMove={handleMove}
      onPointerUp={handleMoveEnd}
      onPointerOut={handleMoveEnd}
    />
  );
};

export default memo(PointerDrag) as typeof PointerDrag;
