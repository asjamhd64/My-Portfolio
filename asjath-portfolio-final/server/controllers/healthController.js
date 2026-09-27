/**
 * GET /api/health
 * Confirms the backend process is up.
 * Does not expose secrets, versions of dependencies, or internal paths.
 */
export function getHealth(req, res) {
  const isProd = process.env.NODE_ENV === 'production'

  const data = {
    status: 'ok',
    service: 'portfolio-api',
    timestamp: new Date().toISOString(),
  }

  // Uptime / env only in non-production to reduce fingerprinting
  if (!isProd) {
    data.uptime = Math.round(process.uptime())
    data.environment = process.env.NODE_ENV || 'development'
  }

  res.status(200).json({
    success: true,
    message: 'Backend is running',
    data,
  })
}
