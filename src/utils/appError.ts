/**
 * A predictable, operational error we can throw anywhere in the request
 * lifecycle and trust the error handler to turn into a clean HTTP response.
 * Anything that is NOT an AppError is treated as an unexpected bug (500).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}