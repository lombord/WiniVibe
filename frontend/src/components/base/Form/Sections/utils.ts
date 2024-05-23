import type { Fields } from "../Fields/types";
import type { SectionProps, SectionsMap } from "./types";

export function createSection<
  F extends Fields,
  N extends SectionsMap,
  SP extends SectionProps<F, N>,
>(
  props: SP & {
    fields?: F;
    nested?: N;
  },
): SP {
  return props;
}
