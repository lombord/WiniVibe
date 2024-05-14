// react
import {
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// used types
import type {
  NonFieldErrors,
  SectionData,
  SectionErrors,
  SectionProps,
  SectionRef,
  SectionsErrors,
  SectionsMap,
  SectionsRef,
} from "./types";
import type {
  FieldsRef,
  Fields as FieldsMap,
  FieldsError,
  FieldError,
} from "../Fields/types";

// used components
import Fields from "../Fields";
import Sections from "./Sections";
import SectionErrorsList from "./SectionErrors";

// other
import { SectionError } from "./errors";
import { callValidator, validateChild } from "../utils";
import { hasOwn, hasProps, keyToLabel } from "@/utils/common";

function Section<F extends FieldsMap, N extends SectionsMap>({
  showLabel = true,
  label,
  sectionKey,
  fields,
  validator,
  nested,
  sectionRef,
}: SectionProps<F, N> & {
  fields?: F;
  nested?: N;
  sectionRef?: Ref<SectionRef<SectionProps<F, N>>>;
}) {
  type SP = SectionProps<F, N>;
  type SD = SectionData<F, N>;
  type SE = SectionErrors<SP>;
  type FE = FieldsError<F>;
  type NE = SectionsErrors<N>;

  if (!(fields || nested)) {
    throw new Error(
      "Neither fields nor nested passed. You should pass at least one of fields or nested props",
    );
  }

  const [sectErrors, setSectErrors] = useState<NonFieldErrors>();
  const resetErrors = useCallback(() => setSectErrors(undefined), []);

  const fieldsRef = useRef<FieldsRef<F>>(null);
  const nestedRef = useRef<SectionsRef<N>>(null);

  const setErrors = useCallback((errors: SE) => {
    if (!errors) return;
    let fieldErrors: FE = {},
      nestedErrors: NE = {},
      nonFieldErrors: NonFieldErrors = {};
    const fields_ = fieldsRef.current;
    const nested_ = nestedRef.current;

    for (const [key, error] of Object.entries(errors)) {
      if (!error) continue;
      if (fields && hasOwn(fields, key)) {
        fieldErrors[key as keyof FE] = error as FieldError;
      } else if (nested && hasOwn(nested, key)) {
        nestedErrors[key as keyof NE] = error as NE[keyof NE];
      } else {
        nonFieldErrors[key] = error as FieldError;
      }
    }

    if (fields_ && hasProps(fieldErrors)) {
      fields_.setFieldsError(fieldErrors);
    }

    if (nested_ && hasProps(nestedErrors)) {
      nested_.setErrors(nestedErrors);
    }

    if (hasProps(nonFieldErrors)) {
      setSectErrors(nonFieldErrors);
    }
  }, []);

  useImperativeHandle(
    sectionRef,
    () => ({
      validate() {
        resetErrors();
        let fieldsData, nestedData;
        let data = {} as SD;
        let hasError = false;
        if (fieldsRef.current) {
          [hasError, fieldsData] = validateChild(fieldsRef.current.validate);
        }

        if (nestedRef.current) {
          [hasError, nestedData] = validateChild(
            nestedRef.current.validate,
            hasError,
          );
        }

        if (!hasError && (fieldsData || nestedData)) {
          data = { ...fieldsData, ...nestedData } as SD;
          if (validator) {
            let error;
            [hasError, data, error] = callValidator(data, validator, hasError);
            if (error instanceof SectionError) {
              setErrors(error.fields);
            }
          }
        }

        if (hasError) {
          throw new Error("Section validation failed");
        }
        return data;
      },
      setErrors,
    }),
    [],
  );

  if (showLabel) {
    label = label || (sectionKey && keyToLabel(sectionKey));
  }

  return (
    <>
      {fields && (
        <div>
          {showLabel && label && <h3>{label}</h3>}
          {sectErrors && <SectionErrorsList errors={sectErrors} />}
          <Fields idPrefix={sectionKey} fields={fields} fieldsRef={fieldsRef} />
        </div>
      )}
      {nested && <Sections sectionsRef={nestedRef} sections={nested} />}
    </>
  );
}

export default Section;
