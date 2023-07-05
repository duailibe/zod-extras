import * as z from "zod";

/**
 * @template {z.ZodTypeAny} T
 * @param {T=} schema
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

  return schema ? validateJson.pipe(schema) : validateJson;
}
