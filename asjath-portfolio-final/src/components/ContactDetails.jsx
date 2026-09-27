import { useState, useCallback, useEffect, useRef } from 'react'
import {
  contactDetails,
  telHref,
  mailtoHref,
  whatsappHref,
} from '../config/contactDetails'

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    return true
  }
  // Fallback for non-secure contexts
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    document.body.removeChild(ta)
    return false
  }
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12 2a10 10 0 0 0-8.66 15.05L2 22l5.1-1.34A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}

function Toast({ message, visible }) {
  return (
    <div
      className={`copy-toast${visible ? ' is-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <CheckIcon />
      <span>{message}</span>
    </div>
  )
}

export default function ContactDetails() {
  const [toast, setToast] = useState({ visible: false, message: '' })
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const showToast = useCallback((message) => {
    clearTimeout(timerRef.current)
    setToast({ visible: true, message })
    timerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 2200)
  }, [])

  const onCopy = useCallback(
    async (text, label) => {
      const ok = await copyText(text)
      showToast(ok ? `${label} copied` : 'Could not copy')
    },
    [showToast]
  )

  return (
    <>
      <div className="contact-grid contact-details-grid">
        {/* Phone */}
        <div className="contact-card contact-detail-card">
          <div className="c-icon" aria-hidden="true">
            <PhoneIcon />
          </div>
          <div className="c-label">PHONE</div>
          <a
            className="c-value c-value-link"
            href={telHref()}
            aria-label={`Call ${contactDetails.phoneDisplay}`}
          >
            {contactDetails.phoneDisplay}
          </a>
          <div className="c-actions">
            <a
              className="c-action"
              href={telHref()}
              aria-label={`Call ${contactDetails.phoneDisplay}`}
            >
              Call
            </a>
            <button
              type="button"
              className="c-action"
              onClick={() => onCopy(contactDetails.phoneTel, 'Phone')}
              aria-label="Copy phone number"
            >
              <CopyIcon />
              Copy
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="contact-card contact-detail-card">
          <div className="c-icon" aria-hidden="true">
            <MailIcon />
          </div>
          <div className="c-label">EMAIL</div>
          <a
            className="c-value c-value-link"
            href={mailtoHref()}
            aria-label={`Email ${contactDetails.email}`}
          >
            {contactDetails.email}
          </a>
          <div className="c-actions">
            <a
              className="c-action"
              href={mailtoHref()}
              aria-label={`Send email to ${contactDetails.email}`}
            >
              Email
            </a>
            <button
              type="button"
              className="c-action"
              onClick={() => onCopy(contactDetails.email, 'Email')}
              aria-label="Copy email address"
            >
              <CopyIcon />
              Copy
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="contact-card contact-detail-card">
          <div className="c-icon" aria-hidden="true">
            <WhatsAppIcon />
          </div>
          <div className="c-label">WHATSAPP</div>
          <a
            className="c-value c-value-link"
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat on WhatsApp at ${contactDetails.phoneDisplay}`}
          >
            {contactDetails.phoneDisplay}
          </a>
          <div className="c-actions">
            <a
              className="c-action c-action-wa"
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open WhatsApp chat with ${contactDetails.phoneDisplay}`}
            >
              Chat
            </a>
          </div>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}
