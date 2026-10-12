import { PetApi } from '../src/core/api/PetApi';
import { StoreApi } from '../src/core/api/StoreApi';
import { UserApi } from '../src/core/api/UserApi';
import { ApiClient } from '../src/core/clients/ApiClient';
import { TestSettings } from '../src/core/configuration/TestSettings';

/**
 * Test fixture containing API clients for all resources.
 */
export interface TestFixture {
  /** Pet API client */
  pets: PetApi;
  /** Store API client */
  store: StoreApi;
  /** User API client */
  users: UserApi;
}

/**
 * Shared setup for all test suites. Builds a fresh HTTP client and one helper per
 * API resource. Calling this in `beforeEach` keeps tests independent (KISS).
 * @returns A new test fixture
 */
export const createTestFixture = (): TestFixture => {
  const apiClient = new ApiClient(TestSettings.current);

  return {
    pets: new PetApi(apiClient),
    store: new StoreApi(apiClient),
    users: new UserApi(apiClient),
  };
};
