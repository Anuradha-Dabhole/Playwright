/**
 * Environment Variable Accessor
 *
 * Provides type-safe, centralized access to process.env values.
 * Avoids scattered process.env reads throughout the codebase.
 */
declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * Retrieves an environment variable by key.
 * Returns the provided default if the variable is not set.
 *
 * @param key - The name of the environment variable
 * @param defaultValue - Fallback value when the variable is absent
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(
      `Required environment variable "${key}" is not set. ` +
        `Copy .env.example to .env and populate the value.`,
    );
  }

  return value;
}

/**
 * Returns true when running inside a CI environment.
 * Most CI platforms set the CI=true environment variable.
 */
export function isCI(): boolean {
  return process.env['CI'] === 'true' || process.env['CI'] === '1';
}

/**
 * Returns the configured headless mode.
 * Defaults to true when not explicitly set.
 */
export function isHeadless(): boolean {
  return getEnvVar('HEADLESS', 'true').toLowerCase() !== 'false';
}
