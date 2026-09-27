import { useState, useCallback } from 'react'
import { submitContact } from '../lib/api'
import SocialLinks from '../components/SocialLinks'
import ContactDetails from '../components/ContactDetails'

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

const INITIAL = { name: '', email: '', subject: '', message: '', website: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Please enter your name'
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!values.subject.trim() || values.subject.trim().length < 3) {
    errors.subject = 'Please add a subject'
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters'
  }
  return errors
}

export default function Contact() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [serverMessage, setServerMessage] = useState('')

  const onChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((err) => {
      if (!err[name]) return err
      const next = { ...err }
      delete next[name]
      return next
    })
    if (status === 'error' || status === 'success') {
      setStatus('idle')
      setServerMessage('')
    }
  }, [status])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const nextErrors = validate(values)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length > 0) return

      setStatus('sending')
      setServerMessage('')

      try {
        const data = await submitContact({
          name: values.name.trim(),
          email: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          website: values.website || '',
        })
        setStatus('success')
        setServerMessage(data?.message || 'Message sent successfully.')
        setValues(INITIAL)
        setErrors({})
      } catch (err) {
        setStatus('error')
        if (err.details && typeof err.details === 'object') {
          setErrors(err.details)
        }
        setServerMessage(err.message || 'Could not send your message. Please try again.')
      }
    },
    [values]
  )

  const isSending = status === 'sending'

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="section-inner">
        <div className="kicker reveal-up">CONTACT</div>
        <h2 className="title reveal-up" id="contact-heading">Let&apos;s build something together.</h2>
        <p className="lede reveal-up">
          Open to junior full-stack developer roles, freelance projects, and collaborations.
          Reach out any time.
        </p>

        <div className="reveal-up">
          <ContactDetails />
        </div>

        <div className="contact-social reveal-up">
          <SocialLinks variant="contact" showEmpty={false} />
        </div>

        <form
          className="contact-form reveal-up"
          onSubmit={onSubmit}
          noValidate
          aria-busy={isSending}
        >
          {/* Honeypot — leave empty; hidden from users */}
          <div className="cf-hp" aria-hidden="true">
            <label htmlFor="cf-website">Website</label>
            <input
              id="cf-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website || ''}
              onChange={onChange}
            />
          </div>
          <div className="cf-row">
            <div className={`cf-field${errors.name ? ' has-error' : ''}`}>
              <label htmlFor="cf-name">Name</label>
              <input
                id="cf-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={values.name}
                onChange={onChange}
                disabled={isSending}
                maxLength={100}
                required
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'cf-name-err' : undefined}
              />
              {errors.name && (
                <span className="cf-error" id="cf-name-err" role="alert">
                  {errors.name}
                </span>
              )}
            </div>
            <div className={`cf-field${errors.email ? ' has-error' : ''}`}>
              <label htmlFor="cf-email">Email</label>
              <input
                id="cf-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={onChange}
                disabled={isSending}
                maxLength={254}
                required
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'cf-email-err' : undefined}
              />
              {errors.email && (
                <span className="cf-error" id="cf-email-err" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className={`cf-field${errors.subject ? ' has-error' : ''}`}>
            <label htmlFor="cf-subject">Subject</label>
            <input
              id="cf-subject"
              name="subject"
              type="text"
              placeholder="What is this about?"
              value={values.subject}
              onChange={onChange}
              disabled={isSending}
              maxLength={150}
              required
              aria-required="true"
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
            />
            {errors.subject && (
              <span className="cf-error" id="cf-subject-err" role="alert">
                {errors.subject}
              </span>
            )}
          </div>

          <div className={`cf-field${errors.message ? ' has-error' : ''}`}>
            <label htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              name="message"
              rows={5}
              placeholder="Tell me a bit about your project or idea…"
              value={values.message}
              onChange={onChange}
              disabled={isSending}
              maxLength={5000}
              required
              aria-required="true"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'cf-message-err' : undefined}
            />
            {errors.message && (
              <span className="cf-error" id="cf-message-err" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          {status === 'success' && (
            <div className="cf-banner success cf-success-anim" role="status">
              {serverMessage}
            </div>
          )}
          {status === 'error' && serverMessage && (
            <div className="cf-banner error" role="alert">
              {serverMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary cf-submit"
            disabled={isSending}
            aria-disabled={isSending}
          >
            {isSending ? (
              <>
                <span className="cf-spinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              'Send message'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
