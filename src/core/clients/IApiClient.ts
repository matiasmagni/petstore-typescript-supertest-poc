import { Test } from 'supertest';

/**
 * Supported HTTP methods.
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';

/**
 * Abstraction over the HTTP client. Used by tests and helpers. Allows swapping in a
 * fake client for unit tests (SOLID - DIP / ISP).
 *
 * `request(...)` returns a supertest `Test`, a lazily-executed thenable that can be
 * further configured (`.send`, `.query`, `.attach`, ...) before it is awaited.
 */
export interface IApiClient {
  /**
   * Creates an HTTP request with the specified method and resource path.
   * @param method - HTTP method to use
   * @param resource - Resource path to request
   * @returns A supertest Test instance
   */
  request(method: HttpMethod, resource: string): Test;
}
