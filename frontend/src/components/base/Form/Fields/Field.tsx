import {
  type Ref,
  useState,
  useImperativeHandle,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";

// used types
import type {
  WidgetKeys,
  PickWidgetRef,
  WidgetValuesMap,
  AwaitedWidgetValuesMap,
  AwaitedWidgetValues,
} from "../Widgets/types";
import type { FieldRef, PickField } from "./types";

// used components
import FieldNotes from "./FieldNotes";
import WidgetDispatch from "./WidgetDispatch";

// other
import { notEmpty } from "@/utils/common";
import { keyToLabel } from "@/utils/text";
import { runValidators } from "../utils";

import styles from "./style.module.css";

const REQUIRED_ERROR_MSG = "This field is required";

function Field<T extends WidgetKeys = "input">({
  fieldKey,
  idPrefix = "",
  hints,
  label,
  validators,
  showLabel = true,
  isRequired = true,
  fieldId,
  fieldName,
  requiredMessage = REQUIRED_ERROR_MSG,
  fieldRef,
  ...restProps
}: PickField<T> & { fieldRef?: Ref<FieldRef<WidgetValuesMap[T]>> }) {
  type V = AwaitedWidgetValuesMap[T];

  const [errors, setErrors] = useState<string[]>();
  const widgetRef = useRef(null) as PickWidgetRef<T>;
  const resetErrors = useCallback(() => setErrors(undefined), []);

  useImperativeHandle(
    fieldRef,
    () => ({
      async validate() {
        resetErrors();
        const _errors: string[] = [];
        let value;
        try {
          value = await Promise.resolve(widgetRef.current?.validate());
          if (notEmpty(value)) {
            if (validators) {
              value = runValidators<AwaitedWidgetValues>(value, validators, _errors);
            }
          } else if (isRequired) {
            _errors.push(requiredMessage);
          }
        } catch (error) {
          _errors.push((error as Error).message);
        }

        if (_errors.length) {
          setErrors(_errors);
          throw new Error("Field validation failed");
        }
        return value as V;
      },

      setFieldError(error) {
        setErrors(typeof error === "string" ? [error] : error);
      },
    }),
    [],
  );

  fieldName = useMemo(() => `${idPrefix}${fieldName || fieldKey}`, []);
  fieldId = useMemo(
    () => `${idPrefix}${fieldId || fieldName || fieldKey}Id`,
    [],
  );
  label = useMemo(() => label || keyToLabel(fieldKey), []);

  return (
    <div className="flex-v-base gap-1">
      {showLabel && (
        <label htmlFor={fieldId} className={styles.fieldLabel}>
          {label}
        </label>
      )}
      <WidgetDispatch
        {...restProps}
        widgetRef={widgetRef}
        id={fieldId}
        name={fieldName}
        isRequired={isRequired}
        resetErrors={resetErrors}
        isInvalid={!!errors}
        label={label}
      />
      <FieldNotes notes={errors || hints} isError={!!errors} />
    </div>
  );
}

export default memo(Field) as typeof Field;
