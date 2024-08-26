import { Ref, memo, useImperativeHandle, useRef } from "react";
// used types
import type {
  SectionsProps,
  SectionsRef,
  SectionsMap,
  SectionsData,
  ChildSectionsRef,
} from "./types";
import type { Entries } from "@/types/utils";

// components
import Section from "./Section";

// other
import { callValidator, validateChildren } from "../utils";

function Sections<S extends SectionsMap>({
  sections,
  sectionsRef,
  inheritedProps,
  validator,
}: SectionsProps<S, SectionsData<S>> & {
  sections: S;
  sectionsRef?: Ref<SectionsRef<S>>;
}) {
  type ChRef = ChildSectionsRef<S>;
  const childSections = useRef({} as ChRef);

  useImperativeHandle(
    sectionsRef,
    () => ({
      async validate() {
        let data = {} as SectionsData<S>;

        let hasError = await validateChildren(
          data,
          childSections.current as any,
          false,
        );
        if (!hasError && validator) {
          [hasError, data] = callValidator(data, validator, hasError);
        }
        if (hasError) throw new Error("Sections validation failed");
        return data;
      },

      setErrors(errors) {
        const children = childSections.current;
        for (const [key, error] of Object.entries(errors)) {
          error && children[key]?.setErrors(error);
        }
      },
    }),
    [],
  );

  return (
    <>
      {(Object.entries(sections) as Entries<typeof sections>).map(
        ([sectionKey, props]) => (
          <Section
            key={sectionKey as string}
            sectionKey={sectionKey as string}
            {...inheritedProps}
            {...props}
            sectionRef={(child) => {
              const map = childSections.current;
              if (child) {
                map[sectionKey] = child as ChRef[typeof sectionKey];
              } else {
                delete map[sectionKey];
              }
            }}
          />
        ),
      )}
    </>
  );
}

export default memo(Sections) as typeof Sections;
