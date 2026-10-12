import { Test } from 'supertest';
import { HttpMethod, IApiClient } from '../clients/IApiClient';

/**
 * Base class for all API resource helpers. Provides common request
 * plumbing so each resource keeps only its endpoint-specific code (DRY).
 * Uses the IApiClient abstraction (SOLID - DIP).
 */
export abstract class BaseApiHelper {
  /**
   * Creates a new BaseApiHelper instance.
   * @param apiClient - API client for making HTTP requests
   */
  protected constructor(protected readonly apiClient: IApiClient) {}

  /**
   * Creates an HTTP request using the underlying API client.
   * @param method - HTTP method to use
   * @param resource - Resource path to request
   * @returns A supertest Test instance
   */
  protected request(method: HttpMethod, resource: string): Test {
    return this.apiClient.request(method, resource);
  }
}
