import { Response } from 'supertest';
import { deserializeOrThrow } from '../../src/core/extensions/responseExtensions';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeSuccessful(why?: string): R;
      toHaveStatusCode(expected: number, why?: string): R;
    }
  }
}

/**
 * Deserializes the response body to `T`, asserting first that a body is present.
 * The TypeScript counterpart of `response.Should().DeserializeAs<T>().Which`.
 */
export function deserializeAs<T>(response: Response, why = ''): T {
  if (!response.text || response.text.trim() === '') {
    throw new Error(
      `Expected a response body to deserialize${why ? ` (${why})` : ''}, but the body was empty.`,
    );
  }
  return deserializeOrThrow<T>(response);
}

/**
 * Custom Jest matchers that understand a supertest Response.
 * Satisfies the DRY principle by moving repeated status checks into one place.
 */
expect.extend({
  toBeSuccessful(received: Response, why = '') {
    const reason = why ? ` ${why}` : '';
    const pass = received.status >= 200 && received.status < 300;
    return {
      pass,
      message: () =>
        `Expected the response to be successful${reason}, but it was ${received.status} (body: ${received.text}).`,
    };
  },

  toHaveStatusCode(received: Response, expected: number, why = '') {
    const reason = why ? ` ${why}` : '';
    const pass = received.status === expected;
    return {
      pass,
      message: () =>
        `Expected the response to have status code ${expected}${reason}, but found ${received.status} (body: ${received.text}).`,
    };
  },
});

export {};
