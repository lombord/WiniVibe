import { type FC, useEffect, useState } from "react";

// used types
import type { FieldWidget, WidgetDispatchProps } from "./types";
import type {
  WidgetKeys,
  WidgetPropsType,
  WidgetValuesMap,
} from "../Widgets/types";

// other
import WidgetsMap from "../Widgets";

function WidgetDispatch<T extends WidgetKeys>({
  widget,
  defaultValue,
  isInvalid,
  resetErrors,
  ...fieldProps
}: WidgetDispatchProps<T>) {
  type V = WidgetValuesMap[T];
  const [value, setValue] = useState((defaultValue || null) as V);

  useEffect(() => {
    if (isInvalid) resetErrors();
  }, [value]);

  if (!widget || typeof widget === "string") {
    widget = { type: widget || "input", props: {} } as FieldWidget<T>;
  }
  const Widget = WidgetsMap[widget.type] as FC<WidgetPropsType[T]>;
  return (
    <Widget
      {...(widget.props as object & WidgetPropsType[T])}
      {...fieldProps}
      value={value}
      isInvalid={isInvalid}
      setValue={setValue}
    />
  );
}

export default WidgetDispatch;
