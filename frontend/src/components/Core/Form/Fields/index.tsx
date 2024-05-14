import { type Ref, useImperativeHandle, useRef } from "react";

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

function Fields<F extends Fields>({
  fields,
  fieldsRef,
  ...restProps
}: FieldsProps<F> & { fields: F; fieldsRef?: Ref<FieldsRef<F>> }) {
  type FP = FieldsProps<F>;
  type FD = FieldsData<FP["fields"]>;
  type CHRef = ChildFieldsRef<FD>;

  const childrenRef = useRef<Partial<CHRef>>({});
  useImperativeHandle(
    fieldsRef,
    () => ({
      validate() {
        const data = {} as FD;
        const children = childrenRef.current as CHRef;
        const hasError = validateChildren(data, children, false);
        if (hasError) {
          throw new Error("Fields validation failed");
        }
        return data;
      },
      setFieldsError(errors) {
        const fields = childrenRef.current as CHRef;
        for (const [key, error] of Object.entries(errors)) {
          error && fields[key].setFieldError(error);
        }
      },
    }),
    [],
  );
  return (
    <div className="flex-h-base gap-3">
      {(Object.entries(fields) as Entries<typeof fields>).map(
        ([fieldKey, props]) => (
          <Field
            key={fieldKey as string}
            fieldKey={fieldKey as string}
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

export default Fields;
