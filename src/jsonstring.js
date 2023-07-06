import * as z from "zod";

/**
 * @template {z.ZodTypeAny} T
 * @param {T=} schema
 * @returns {T extends undefined ? z.ZodEffects<z.ZodString, any, string> : z.ZodPipeline<z.ZodEffects<z.ZodString, any, string>, T>}
 */
export function zjsonstring(schema) {
  const validateJson = z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: e instanceof Error ? e.message : "Invalid JSON"
      });
      return z.NEVER;
    }
  });

  return /** @type {any} */ (schema ? validateJson.pipe(schema) : validateJson);
}
