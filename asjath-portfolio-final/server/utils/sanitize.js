/**
 * Strip HTML tags and control characters, trim, collapse whitespace.
 */
export function sanitizeString(input, maxLen = 5000) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

/** Preserve newlines in message body while still stripping tags/controls. */
export function sanitizeMessage(input, maxLen = 5000) {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen)
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function isValidEmail(email) {
  if (typeof email !== 'string' || email.length > 254) return false
  return EMAIL_RE.test(email)
}

/**
 * Lightweight spam heuristics — not a full anti-spam system.
 * Returns a reason string if the message looks abusive, otherwise null.
 */
export function detectSpam({ name, email, subject, message }) {
  const text = `${name} ${subject} ${message}`.toLowerCase()

  // Too many URLs
  const urls = message.match(/https?:\/\/|www\./gi) || []
  if (urls.length >= 5) return 'Too many links in message'

  // Common spam phrases
  const spamPhrases = [
    'viagra',
    'cialis',
    'crypto airdrop',
    'double your',
    'work from home and earn',
    'seo backlink',
    'buy followers',
  ]
  if (spamPhrases.some((p) => text.includes(p))) return 'Message rejected'

  // Homogeneous gibberish (very long repeated chars)
  if (/(.)\1{20,}/.test(message)) return 'Message rejected'

  // Email local-part equals whole message (bot paste)
  if (message.trim().toLowerCase() === email.trim().toLowerCase()) {
    return 'Message rejected'
  }

  return null
}
