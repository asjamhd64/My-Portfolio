/**
 * Operational errors that are safe to expose to clients.
 * Unexpected errors should still go through the error middleware
 * but will not leak stack traces in production.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
    Error.captureStackTrace?.(this, this.constructor)
  }
}
