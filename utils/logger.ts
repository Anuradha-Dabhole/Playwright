/**
 * Logger
 *
 * Lightweight, structured logging utility for the automation framework.
 * Wraps console methods with consistent prefixes so test output is easy
 * to scan and debug without being overwhelming.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *
 *   logger.step('Adding product to cart');
 *   logger.info('Environment: QA');
 *   logger.warn('Skipping optional assertion');
 *   logger.error('Login failed unexpectedly');
 */

declare const console: {
  log: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
};

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function timestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

export const logger = {
  /**
   * Logs a test step description.
   * Visually distinct from general info messages — used to mark
   * meaningful automation actions (e.g. "Logging in as standard_user").
   */
  step(message: string): void {
    console.log(
      `${COLORS.cyan}[STEP]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset} → ${message}`,
    );
  },

  /**
   * Logs general informational output (e.g. environment, configuration).
   */
  info(message: string): void {
    console.log(
      `${COLORS.green}[INFO]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset}   ${message}`,
    );
  },

  /**
   * Logs a non-fatal warning that does not stop test execution.
   */
  warn(message: string): void {
    console.warn(
      `${COLORS.yellow}[WARN]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset}   ${message}`,
    );
  },

  /**
   * Logs an error-level message for failures or unexpected states.
   */
  error(message: string): void {
    console.error(
      `${COLORS.red}[ERROR]${COLORS.reset} ${COLORS.gray}${timestamp()}${COLORS.reset}  ${message}`,
    );
  },

  /**
   * Logs a success confirmation, typically at the end of a test flow.
   */
  success(message: string): void {
    console.log(
      `${COLORS.green}[✓]${COLORS.reset}    ${COLORS.gray}${timestamp()}${COLORS.reset}   ${message}`,
    );
  },
};
