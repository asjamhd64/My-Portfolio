/**
 * Wraps an async Express handler so rejected promises
 * are forwarded to the centralized error middleware.
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
