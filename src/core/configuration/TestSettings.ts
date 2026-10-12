/**
 * Immutable test settings. Sourced from environment variables first, with sensible
 * defaults (KISS/DRY).
 */

/**
 * Retrieves an environment variable value with a fallback default.
 * @param name - The name of the environment variable
 * @param defaultValue - Default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
const getEnvironmentVariable = (name: string, defaultValue: string): string => {
  return process.env[name] ?? defaultValue;
};

export class TestSettings {
  /** Singleton instance of test settings. */
  static current: TestSettings;

  /** Base URL for the Petstore API. */
  readonly baseUrl: string;

  /** Request timeout in seconds. */
  readonly timeoutSeconds: number;

  /**
   * Creates a new TestSettings instance.
   * @param baseUrl - Base URL for the API
   * @param timeoutSeconds - Request timeout in seconds
   */
  private constructor(baseUrl: string, timeoutSeconds: number) {
    this.baseUrl = baseUrl;
    this.timeoutSeconds = timeoutSeconds;
  }

  /**
   * Creates a TestSettings instance from environment variables.
   * @returns A new TestSettings instance
   */
  private static create(): TestSettings {
    const baseUrl = getEnvironmentVariable(
      'PETSTORE_BASE_URL',
      'https://petstore.swagger.io/v2',
    );
    const timeoutSeconds = Number.parseInt(
      getEnvironmentVariable('PETSTORE_TIMEOUT_SECONDS', '30'),
      10,
    );
    return new TestSettings(baseUrl, timeoutSeconds);
  }

  static {
    TestSettings.current = TestSettings.create();
  }
}
