import type { ProductBody } from "@models";

const UUID_REGEX =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

const PRODUCT_PROP_TYPES: Record<keyof ProductBody, string> = {
  name: "string",
  description: "string",
  price: "number",
  category: "string",
  inStock: "boolean",
};

export const productBodyValidator = (obj: unknown): obj is ProductBody => {
  if (!obj || typeof obj !== "object") return false;
  const entries = Object.entries(PRODUCT_PROP_TYPES);

  return (
    entries.length === Object.keys(obj).length &&
    entries.every(
      ({ 0: key, 1: val }) =>
        typeof (obj as Record<string, unknown>)[key] === val,
    )
  );
};

export const productPartValidator = (
  obj: unknown,
): obj is Partial<ProductBody> => {
  if (!obj || typeof obj !== "object") return false;

  const entries = Object.entries(obj);

  return (
    entries.length > 0 &&
    entries.every(
      ({ 0: key, 1: val }) =>
        key in PRODUCT_PROP_TYPES &&
        typeof val === PRODUCT_PROP_TYPES[key as keyof ProductBody],
    )
  );
};

export const productUUIDValidator = (value: unknown) =>
  typeof value === "string" && UUID_REGEX.test(value);
