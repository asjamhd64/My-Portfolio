import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import apiRoutes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { requestLogger } from './middleware/requestLogger.js'

const app = express()

const PORT = Number(process.env.PORT) || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'
const isProd = NODE_ENV === 'production'

// Trust reverse proxy (nginx, Cloudflare, etc.) so req.ip / rate limit work
if (process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1)
}

app.disable('x-powered-by')

// ---------- Security headers ----------
app.use(
  helmet({
    contentSecurityPolicy: false, // API-only; CSP belongs on the frontend host
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
  })
)

// ---------- CORS ----------
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true) // non-browser clients
      if (allowedOrigins.includes('*')) {
        // Reflect request origin when wildcard configured (avoid credentials issues)
        return callback(null, true)
      }
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
    maxAge: 600,
  })
)

// ---------- Body parsing (strict size limits) ----------
const jsonLimit = process.env.JSON_BODY_LIMIT || '32kb'
app.use(express.json({ limit: jsonLimit, strict: true }))
app.use(express.urlencoded({ extended: false, limit: jsonLimit }))

// ---------- Logging ----------
app.use(requestLogger())

// ---------- API ----------
app.use('/api', apiRoutes)

// ---------- 404 + errors ----------
app.use(notFoundHandler)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT} (${NODE_ENV})`)
})

function shutdown(signal) {
  console.log(`[server] ${signal} — shutting down`)
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// Do not crash on unhandled rejections in a way that leaks state; log only
process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandledRejection', isProd ? String(reason) : reason)
})

export default app
