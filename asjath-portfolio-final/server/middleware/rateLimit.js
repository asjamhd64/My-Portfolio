/**
 * Simple in-memory rate limiter (no external Redis required).
 * Suitable for a single-process portfolio API.
 *
 * For multi-instance production, swap for a shared store.
 */

function getClientKey(req) {
  // Prefer first X-Forwarded-For hop when behind a trusted proxy
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.length) {
    return xf.split(',')[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || 'unknown'
}

/**
 * @param {object} options
 * @param {number} options.windowMs
 * @param {number} options.max
 * @param {string} [options.message]
 */
export function rateLimit({ windowMs, max, message }) {
  const hits = new Map()

  // Periodic cleanup to avoid unbounded growth
  const cleanup = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of hits) {
      if (now > entry.resetAt) hits.delete(key)
    }
  }, Math.min(windowMs, 60_000))
  cleanup.unref?.()

  return function rateLimitMiddleware(req, res, next) {
    const key = getClientKey(req)
    const now = Date.now()
    let entry = hits.get(key)

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs }
      hits.set(key, entry)
    }

    entry.count += 1

    const remaining = Math.max(0, max - entry.count)
    res.setHeader('X-RateLimit-Limit', String(max))
    res.setHeader('X-RateLimit-Remaining', String(remaining))
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(retryAfter))
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests. Please try again later.',
      })
    }

    next()
  }
}
