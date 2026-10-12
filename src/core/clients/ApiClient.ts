import request, { Test } from 'supertest';
import { TestSettings } from '../configuration/TestSettings';
import { HttpMethod, IApiClient } from './IApiClient';

/**
 * A single supertest client bound to the base URL and timeout.
 * Centralizes configuration so the whole suite shares the same defaults (DRY).
 */
export class ApiClient implements IApiClient {
  /** Base URL for API requests. */
  private readonly baseUrl: string;
  
  /** Request timeout in milliseconds. */
  private readonly timeoutMs: number;

  /**
   * Creates a new ApiClient instance.
   * @param settings - Test settings containing base URL and timeout configuration
   */
  constructor(settings: TestSettings) {
    this.baseUrl = settings.baseUrl;
    this.timeoutMs = settings.timeoutSeconds * 1000;
  }

  /**
   * Creates an HTTP request with the specified method and resource path.
   * @param method - HTTP method to use
   * @param resource - Resource path to request
   * @returns A supertest Test instance
   */
  request(method: HttpMethod, resource: string): Test {
    const agent = request(this.baseUrl);
    let test: Test;

    switch (method) {
      case 'get':
        test = agent.get(resource);
        break;
      case 'post':
        test = agent.post(resource);
        break;
      case 'put':
        test = agent.put(resource);
        break;
      case 'delete':
        test = agent.delete(resource);
        break;
      case 'patch':
        test = agent.patch(resource);
        break;
      case 'head':
        test = agent.head(resource);
        break;
      case 'options':
        test = agent.options(resource);
        break;
    }

    return test.timeout({ response: this.timeoutMs, deadline: this.timeoutMs });
  }
}
