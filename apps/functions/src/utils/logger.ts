/**
 * Enhanced logging utilities for Firebase Functions
 */
import * as firebaseLogger from "firebase-functions/logger";

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Enhanced logger with context support
 */
class Logger {
  /**
     * Log a debug message
     * @param message - Log message
     * @param context - Optional context
     * @param data - Optional data to include
     */
  debug(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  /**
     * Log an info message
     * @param message - Log message
     * @param context - Optional context
     * @param data - Optional data to include
     */
  info(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  /**
     * Log a warning message
     * @param message - Log message
     * @param context - Optional context
     * @param data - Optional data to include
     */
  warn(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  /**
     * Log an error message
     * @param message - Log message
     * @param context - Optional context
     * @param data - Optional data to include
     */
  error(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  /**
     * Generic log method
     * @param level - Log level
     * @param message - Log message
     * @param context - Optional context
     * @param data - Optional data to include
     */
  private log(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown
  ): void {
    const logMessage = context ?
      `[${context}] ${message}` :
      message;

    switch (level) {
      case LogLevel.DEBUG:
        firebaseLogger.debug(logMessage, data);
        break;
      case LogLevel.INFO:
        firebaseLogger.info(logMessage, data);
        break;
      case LogLevel.WARN:
        firebaseLogger.warn(logMessage, data);
        break;
      case LogLevel.ERROR:
        firebaseLogger.error(logMessage, data);
        break;
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
