import { Router } from 'express'
import { submitContact } from '../controllers/contactController.js'
import { rateLimit } from '../middleware/rateLimit.js'

const router = Router()

const windowMs = Number(process.env.CONTACT_RATE_WINDOW_MS) || 15 * 60 * 1000
const max = Number(process.env.CONTACT_RATE_MAX) || 8

router.post(
  '/',
  rateLimit({
    windowMs,
    max,
    message: 'Too many contact attempts. Please try again later.',
  }),
  submitContact
)

export default router
