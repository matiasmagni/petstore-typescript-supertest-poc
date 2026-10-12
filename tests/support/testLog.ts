import { addMsg } from 'jest-html-reporters/helper';

/**
 * Thin logging facade. Entries are written to the console and attached to the
 * generated HTML report.
 */

/**
 * Writes a log message to console and HTML report.
 * @param prefix - Log prefix (INFO, PASS, etc.)
 * @param message - Message to log
 */
const write = (prefix: string, message: string): void => {
  console.log(`[${prefix}] ${message}`);
  void addMsg({ message: `[${prefix}] ${message}` }).catch(() => undefined);
};

/**
 * Logger instance with info and pass methods.
 */
export const log = {
  /**
   * Logs an info message.
   * @param message - Message to log
   */
  info: (message: string): void => {
    write('INFO', message);
  },

  /**
   * Logs a pass message.
   * @param message - Message to log
   */
  pass: (message: string): void => {
    write('PASS', message);
  },
};
