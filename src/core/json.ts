/**
 * Central place for all JSON serialization behavior (DRY).
 *
 * Drops `null`/`undefined` properties before the body is sent.
 */

/**
 * Sanitizes an object by removing null and undefined properties.
 * @param value - The value to sanitize
 * @returns The sanitized value with null/undefined properties removed
 */
export const sanitize = <T>(value: T): T => {
  return stripNulls(value) as T;
};

/**
 * Recursively removes null and undefined properties from objects and arrays.
 * @param value - The value to strip nulls from
 * @returns The value with null/undefined properties removed
 */
const stripNulls = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripNulls);
  }

  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested === null || nested === undefined) {
        continue;
      }
      result[key] = stripNulls(nested);
    }
    return result;
  }

  return value;
};

/**
 * Parses a lenient date string into a Date object.
 * @param value - The date string to parse
 * @returns A Date object if parsing succeeds, otherwise null
 */
export const parseLenientDate = async (value: string): Promise<Date | null> => {
  if (!value || value.trim() === '') {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
