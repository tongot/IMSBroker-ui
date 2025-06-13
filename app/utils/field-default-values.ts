import { CoverStructureFieldDto } from "../api/ims-client";

export default function GetFieldDefaultValues(fields: CoverStructureFieldDto[] | undefined) {
  const defaultValues: { [key: string]: any } = {};
  if (!fields) {
    return defaultValues;
  }
  fields.forEach((r) => {
      if (r.defaultValue !== undefined && r.defaultValue !== null) {
        defaultValues[r?.name||""] = r.value;
      }
  });
  return defaultValues;
}