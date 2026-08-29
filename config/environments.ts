/**
 * Environment Configuration
 *
 * Defines typed configurations for each supported environment.
 * The active environment is selected by the TEST_ENVIRONMENT variable.
 */
declare const process: {
  env: Record<string, string | undefined>;
};

/** Supported deployment environments */
export type Environment = 'dev' | 'qa' | 'staging' | 'production';

/** Shape of a single environment's configuration */
export interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
}

/** Map of all supported environment configurations */
const ENVIRONMENTS: Record<Environment, EnvironmentConfig> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://www.saucedemo.com',
  },
  qa: {
    name: 'qa',
    baseUrl: 'https://www.saucedemo.com',
  },
  staging: {
    name: 'staging',
    baseUrl: 'https://www.saucedemo.com',
  },
  production: {
    name: 'production',
    baseUrl: 'https://www.saucedemo.com',
  },
};

/**
 * Returns the environment configuration for the currently active environment.
 *
 * Priority order:
 *   1. BASE_URL environment variable (overrides the config map)
 *   2. Config map entry for TEST_ENVIRONMENT
 *   3. Default: 'qa'
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const envName = (
    typeof process !== 'undefined' && process.env?.['TEST_ENVIRONMENT']
      ? process.env['TEST_ENVIRONMENT']
      : 'qa'
  ) as Environment;

  const config: EnvironmentConfig | undefined = ENVIRONMENTS[envName];

  if (!config) {
    throw new Error(
      `Unknown TEST_ENVIRONMENT: "${envName}". ` +
      `Valid values are: ${Object.keys(ENVIRONMENTS).join(', ')}`,
    );
  }

  // Allow BASE_URL override so CI pipelines can point to any URL without
  // touching the config map.
  const overrideUrl =
    typeof process !== 'undefined' ? process.env?.['BASE_URL'] : undefined;

  if (overrideUrl) {
    return { ...config, baseUrl: overrideUrl };
  }

  return config;
}

