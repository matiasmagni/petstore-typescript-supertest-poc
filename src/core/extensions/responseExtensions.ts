import { Response } from 'supertest';

/**
 * Helpers to safely read content from a supertest Response (DRY).
 */

/**
 * Deserializes the response body as JSON or throws if empty/invalid.
 * @param response - The HTTP response
 * @returns The deserialized response body
 * @throws Error if the response is empty or cannot be deserialized
 */
export const deserializeOrThrow = <T>(response: Response): T => {
  const content = response.text;

  if (!content || content.trim() === '') {
    throw new Error(
      `Cannot deserialize empty response content. Status: ${response.status}`,
    );
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    throw new Error(`Failed to deserialize content to ${typeof content}`);
  }
};

/**
 * Gets the request URL from the response.
 * @param response - The HTTP response
 * @returns The request URL or 'unknown' if not available
 */
export const resource = (response: Response): string => {
  return response.request?.url ?? 'unknown';
};
