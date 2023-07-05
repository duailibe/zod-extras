import mapValues from "just-map-values";
import * as z from "zod";

/**
 * @template {z.ZodRawShape} T
 * @param {T} schema
 */
export function zformdata(schema) {
  return z
    .custom(
      val => val instanceof FormData,
      val => ({
        message: `Expected FormData, received ${z.getParsedType(val)}`
      })
    )
    .pipe(
      z.preprocess(formData => {
        if (formData instanceof FormData) {
          return mapValues(schema, (valueSchema, key) =>
            getFormValue(formData, key, valueSchema)
          );
        }
      }, z.object(schema))
    );
}

/**
 * @param {FormData} formData
 * @param {string} name
 * @param {z.ZodTypeAny} schema
 */
function getFormValue(formData, name, schema) {
  if (schema instanceof z.ZodEffects) {
    return getFormValue(formData, name, schema.innerType());
  }

  if (schema instanceof z.ZodPipeline) {
    return getFormValue(formData, name, schema._def.in);
  }

  if (schema instanceof z.ZodCatch) {
    return getFormValue(formData, name, schema.removeCatch());
  }

  if (schema instanceof z.ZodOptional) {
    return getFormValue(formData, name, schema.unwrap());
  }

  if (schema instanceof z.ZodArray) {
    return formData.getAll(name);
  }

  const value = formData.get(name);

  if (value === null) {
    return undefined;
  }

  return value;
}
