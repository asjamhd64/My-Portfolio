import morgan from 'morgan'

/**
 * HTTP request logger.
 * Uses a compact format in production, verbose in development.
 */
export function requestLogger() {
  const isProd = process.env.NODE_ENV === 'production'
  return morgan(isProd ? 'combined' : 'dev')
}
