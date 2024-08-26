import { type Ref, useImperativeHandle, useRef, memo } from "react";

// used types
import type {
  ChildFieldsRef,
  FieldsData,
  FieldsProps,
  FieldsRef,
  Fields,
} from "./types";
import type { Entries } from "@/types/utils";

// used components
import Field from "./Field";

// other
import { validateChildren } from "../utils";
import { hasOwn } from "@/utils/common";

function Fields<F extends Fields>({
  fields,
  fieldsRef,
  commonFieldProps,
  ...restProps
}: FieldsProps<F> & { fields: F; fieldsRef?: Ref<FieldsRef<F>> }) {
  type FD = FieldsData<F>;
  type CHRef = ChildFieldsRef<F>;

  const childrenRef = useRef<Partial<CHRef>>({});
  useImperativeHandle(
    fieldsRef,
    () => ({
      async validate() {
        const data = {} as FD;
        const children = childrenRef.current as CHRef;
        const hasError = await validateChildren(data, children, false);
        if (hasError) {
          console.log("Fields Validation failed");
          throw new Error("Fields validation failed");
        }
        return data;
      },

      setFieldsError(errors) {
        const fields = childrenRef.current as CHRef;
        for (const [key, error] of Object.entries(errors)) {
          if (error && hasOwn(fields, key)) {
            fields[key].setFieldError(error);
          }
        }
      },
    }),
    [],
  );
  
  return (
    <div className="flex-v-base gap-3">
      {(Object.entries(fields) as Entries<typeof fields>).map(
        ([fieldKey, props]) => (
          <Field
            key={fieldKey as string}
            fieldKey={fieldKey as string}
            {...commonFieldProps}
            {...props}
            {...restProps}
            fieldRef={(child) => {
              const fields = childrenRef.current;
              if (child) {
                fields[fieldKey] = child as CHRef[typeof fieldKey];
              } else {
                delete fields[fieldKey];
              }
            }}
          />
        ),
      )}
    </div>
  );
}

export default memo(Fields) as typeof Fields;
