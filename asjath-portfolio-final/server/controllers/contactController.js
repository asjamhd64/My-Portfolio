import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  sanitizeString,
  sanitizeMessage,
  isValidEmail,
  detectSpam,
} from '../utils/sanitize.js'

/**
 * In-memory store for development / demo only.
 * Replace with DB or email provider in production — never commit secrets here.
 */
const messages = []

/**
 * POST /api/contact
 * Body: { name, email, subject, message, website? }
 * `website` is a honeypot — must be empty; bots that fill it are rejected.
 */
export const submitContact = asyncHandler(async (req, res) => {
  const raw = req.body || {}

  // Honeypot: if present and non-empty, pretend success (do not tip off bots)
  const honeypot = typeof raw.website === 'string' ? raw.website.trim() : ''
  if (honeypot) {
    return res.status(201).json({
      success: true,
      message: 'Thank you — your message has been received. I will get back to you soon.',
      data: { id: 'ok', receivedAt: new Date().toISOString() },
    })
  }

  const name = sanitizeString(raw.name, 100)
  const email = sanitizeString(raw.email, 254).toLowerCase()
  const subject = sanitizeString(raw.subject, 150)
  const message = sanitizeMessage(raw.message, 5000)

  const errors = {}

  if (!name || name.length < 2) {
    errors.name = 'Name is required (min 2 characters)'
  }
  if (!email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (!subject || subject.length < 3) {
    errors.subject = 'Subject is required (min 3 characters)'
  }
  if (!message || message.length < 10) {
    errors.message = 'Message is required (min 10 characters)'
  } else if (message.length > 5000) {
    errors.message = 'Message is too long (max 5000 characters)'
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed', 400, errors)
  }

  const spamReason = detectSpam({ name, email, subject, message })
  if (spamReason) {
    // Generic message — do not reveal detection logic
    throw new AppError('Unable to send message. Please try again later.', 400)
  }

  const entry = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    subject,
    message,
    receivedAt: new Date().toISOString(),
    ip: req.ip || req.socket?.remoteAddress || null,
  }

  messages.push(entry)
  if (messages.length > 200) messages.shift()

  // Log minimal metadata only (no full message body in production)
  if (process.env.NODE_ENV === 'production') {
    console.log('[contact] received', { id: entry.id, at: entry.receivedAt })
  } else {
    console.log('[contact] new message', {
      id: entry.id,
      name: entry.name,
      email: entry.email,
      subject: entry.subject,
    })
  }

  res.status(201).json({
    success: true,
    message: 'Thank you — your message has been received. I will get back to you soon.',
    data: {
      id: entry.id,
      receivedAt: entry.receivedAt,
    },
  })
})
