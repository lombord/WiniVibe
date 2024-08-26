import { type FC, memo, useLayoutEffect, useMemo, useState } from "react";

// used types
import type { FieldWidget, WidgetDispatchProps } from "./types";
import type { WidgetKeys, WidgetPropsType } from "../Widgets/types";

// other
import WidgetsMap from "../Widgets";

function WidgetDispatch<T extends WidgetKeys>({
  widget,
  defaultValue,
  isInvalid,
  resetErrors,
  ...fieldProps
}: WidgetDispatchProps<T>) {
  const [value, setValue] = useState(defaultValue);

  useLayoutEffect(() => {
    if (isInvalid) resetErrors();
  }, [value]);

  const widgetObj = useMemo(() => {
    let _widget = widget;
    if (!_widget || typeof _widget === "string") {
      _widget = { type: _widget || "input", props: {} } as FieldWidget<T>;
    }
    return _widget;
  }, []);

  const Widget = WidgetsMap[widgetObj.type] as FC<WidgetPropsType[T]>;
  return (
    <Widget
      {...(widgetObj.props as object & WidgetPropsType[T])}
      {...fieldProps}
      value={value}
      isInvalid={isInvalid}
      setValue={setValue}
    />
  );
}

export default memo(WidgetDispatch) as typeof WidgetDispatch;
