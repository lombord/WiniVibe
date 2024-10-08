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
import { animatePromise, axiosBase } from "@/utils/request";
import { useToastStore } from "@/stores/toastStore";

function Form<F extends Fields = Fields, S extends SectionsMap = SectionsMap>({
  title,
  submitTitle = "submit",
  structure,
  validated,
  config,
  succeed,
  className = "",
}: FormProps<F, S, SectionData<F, S>>) {
  type SD = SectionData<F, S>;
  type FP = FormProps<F, S, SD>;

  const showError = useToastStore.use.showError();
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>();
  const structureRef = useRef<SectionRef<FP["structure"], SD>>(null);

  const proceedRequest = useCallback(async (data: SD) => {
    if (!config) return;
    try {
      setStatus("processing");
      if (typeof config === "function") {
        return await config(data);
      }
      const response = await axiosBase({ ...config, data });
      succeed && succeed(response.data);
    } catch (error) {
      showError("Something went wrong please try again.");

      if (isAxiosError(error)) {
        const serverError = error.response?.data;
        if (serverError && typeof serverError !== "string") {
          structureRef.current?.setErrors(serverError);
        }
      } else {
        throw error;
      }
    } finally {
      setStatus(undefined);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!structureRef.current) return;
      let data;
      try {
        setStatus("validating");
        data = await animatePromise(
          structureRef.current.validate(),
          setLoading,
        );
        if (!data) throw new Error("Invalid data");
        if (!config) {
          if (validated) {
            await animatePromise(validated(data), setLoading);
          }
          return;
        }
      } catch (error) {
        showError("Validation failed please try again.");
        console.log(error);
        return;
      } finally {
        setStatus(undefined);
      }
      animatePromise(proceedRequest(data), setLoading);
    },
    [],
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`flex-v-base gap-3 ${className}`}
    >
      {title && <h1 className="my-6 text-center text-secondary">{title}</h1>}
      <Section sectionRef={structureRef} {...structure} />
      <Button
        color="primary"
        isLoading={isLoading}
        className="mt-4 font-bold uppercase"
        size="lg"
        type="submit"
      >
        {status || submitTitle}
      </Button>
    </form>
  );
}

export default Form;
