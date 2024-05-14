import { useCallback, useRef, useState } from "react";

// used types
import type { FormProps } from "./types";
import type { SectionRef, SectionsMap, SectionData } from "./Sections/types";
import type { Fields } from "./Fields/types";

// used components
import { Section } from "./Sections";
import { Button } from "@nextui-org/react";

// other
import { isAxiosError } from "axios";
import { useSessionStore } from "@/stores/sessionStore";
import { animatePromise } from "@/utils/request";

function Form<F extends Fields = Fields, S extends SectionsMap = SectionsMap>({
  title,
  submitTitle = "submit",
  structure,
  config,
  succeed,
}: FormProps<F, S, SectionData<F, S>>) {
  type SD = SectionData<F, S>;
  type FP = FormProps<F, S, SD>;

  const [isLoading, setLoading] = useState(false);
  const structureRef = useRef<SectionRef<FP["structure"], SD>>(null);

  const request = useSessionStore.use.request();

  const proceedRequest = useCallback(async (data: SD) => {
    if (!config) return;
    try {
      if (typeof config == "function") {
        return await config(data);
      }
      const response = await request({ ...config, data });
      succeed && succeed(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const serverError = error.response?.data;
        if (serverError && typeof serverError !== "string") {
          structureRef.current?.setErrors(serverError);
        }
      } else {
        throw error;
      }
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!structureRef.current) return;
    let data;
    try {
      data = structureRef.current.validate();
      if (!data) throw new Error("Invalid data");
      if (!config) {
        succeed && succeed(data);
        return;
      }
    } catch (error) {
      console.log("Form Validation error:\n", error);
      return;
    }
    animatePromise(proceedRequest(data), setLoading);
  }, []);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex-h-base gap-3">
      {title && <h1 className="my-6 text-center text-secondary">{title}</h1>}
      <Section sectionRef={structureRef} {...structure} />
      <Button
        color="primary"
        isLoading={isLoading}
        className="mt-4 font-bold uppercase"
        size="lg"
        type="submit"
      >
        {submitTitle}
      </Button>
    </form>
  );
}

export default Form;
