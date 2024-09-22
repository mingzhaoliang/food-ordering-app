import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ZodIssue } from "zod";

export interface FieldValue {
  name: string;
  image: { publicId: string; type: string; resourceType: string };
  imageFile: File;
}

const escapeRegExp = (string: string): string => {
  // Escapes special characters
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const transformToFormData = <T extends FieldValues>(
  form: UseFormReturn<T, any, undefined>,
  formData: FormData,
  name: Path<T>
) => {
  (form.getValues(name) as FieldValue[]).forEach((item, index) => {
    formData.set(`${name}.${index}.name`, item.name);
    formData.set(`${name}.${index}.image`, JSON.stringify(item.image));
    formData.append(`${name}.${index}.imageFile`, item.imageFile);
  });
};

const transformFromFormData = (data: Record<string, string | object | File>, name: string) => {
  const transformedField: FieldValue[] = [];
  const escapedName = escapeRegExp(name);
  const regex = new RegExp(`^${escapedName}\\.(\\d+)\\.(\\w+)$`);

  Object.keys(data)
    .filter((key) => key.startsWith(`${name}.`))
    .forEach((key) => {
      // Extract the index and the field name (e.g., "0" and "name")
      const match = key.match(regex);
      if (match) {
        const index = Number(match[1]);
        const field = match[2] as keyof FieldValue;

        // Ensure the array has enough slots
        transformedField[index] = transformedField[index] || {};

        // Assign the field value to the corresponding object
        transformedField[index][field] = field === "image" ? JSON.parse(data[key] as string) : data[key];
      }

      // Remove the original flattened key from the transformed data
      delete data[key];
    });

  data[name] = transformedField;
};

const transformErrors = (errors: ZodIssue[], name: string) => {
  const transformedErrors = errors
    .filter((error) => error.path.includes(name))
    .reduce((acc, error) => {
      const index = Number(error.path[1]);
      acc[index] = acc[index] || {};
      acc[index][error.path[2]] = [error.message];
      return acc;
    }, [] as Array<Record<string, string[]>>);

  return transformedErrors;
};

export { transformErrors, transformFromFormData, transformToFormData };
