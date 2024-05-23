import type { SectionErrors } from "./types";

export class SectionError<T extends {}> extends Error {
  fields;

  constructor(fields: SectionErrors<T>) {
    super();
    this.fields = fields;
  }
}
