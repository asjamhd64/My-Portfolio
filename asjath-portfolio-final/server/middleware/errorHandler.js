import { AppError } from '../utils/AppError.js'

/**
 * 404 for unmatched API routes.
 */
export function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404))
}

/**
 * Centralized error handler.
 * Never leaks stack traces, env vars, or internal paths in production.
 */
export function errorHandler(err, req, res, next) {
  // CORS rejection from custom origin callback
  if (err && typeof err.message === 'string' && err.message.startsWith('CORS:')) {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
    })
  }

  // Body parser / payload too large
  if (err?.type === 'entity.too.large' || err?.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Request body too large',
    })
  }

  // Invalid JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON body',
    })
  }

  const statusCode = err.statusCode || err.status || 500
  const isOperational = err.isOperational === true
  const isProd = process.env.NODE_ENV === 'production'

  if (!isProd) {
    console.error('[error]', err)
  } else if (!isOperational) {
    // Log unexpected errors without echoing to client
    console.error('[error]', err?.message || err)
  }

  const payload = {
    success: false,
    message:
      isOperational || !isProd
        ? err.message || 'Something went wrong'
        : 'Internal server error',
  }

  if (err.details && isOperational) {
    payload.details = err.details
  }

  // Never include stack in production responses
  if (!isProd && err.stack) {
    payload.stack = err.stack
  }

  res.status(statusCode).json(payload)
}
