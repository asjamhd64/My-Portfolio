import { useRef, useEffect, useState } from 'react'
import DownloadCV from '../components/DownloadCV'

/**
 * Profile photo path — replace public/profile.jpg with a real photo when available.
 * Until then the initials fallback is shown.
 */
const PROFILE_SRC = '/profile.jpg'

function ProfileFrame() {
  const frameRef = useRef(null)
  const imgWrapRef = useRef(null)
  const imgRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    const wrap = imgWrapRef.current
    if (!frame || !wrap) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const onMove = (e) => {
      const rect = frame.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      wrap.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`
    }
    const onLeave = () => {
      wrap.style.transform = 'rotateY(0deg) rotateX(0deg)'
    }

    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)
    return () => {
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="about-photo-frame" ref={frameRef}>
      <div className="about-photo-ring" aria-hidden="true" />
      <div className="about-photo-glow" aria-hidden="true" />
      <div className="about-photo-wrap" ref={imgWrapRef}>
        <img
          ref={imgRef}
          className={`about-photo${loaded ? ' is-loaded' : ''}`}
          src={PROFILE_SRC}
          alt="Asjath Mubeen"
          width={280}
          height={340}
          decoding="async"
          onLoad={() => {
            setLoaded(true)
            setFailed(false)
          }}
          onError={() => {
            setFailed(true)
            setLoaded(false)
          }}
          style={{ display: failed ? 'none' : 'block' }}
        />
        <div className="about-photo-fallback" hidden={!failed} aria-hidden={!failed}>
          <span>AM</span>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="section-inner about-grid about-grid-v2">
        {/* Identity column */}
        <div className="about-identity reveal-up">
          <ProfileFrame />

          <div className="about-card about-id-card">
            <div className="about-id-badge">
              <span className="dot-live" />
              Open to work
            </div>
            <div className="role">Asjath Mubeen</div>
            <div className="about-id-title">Full-Stack Developer</div>
            <div className="loc">Undergraduate · Aspiring Developer</div>

            <div className="about-meta">
              <div>
                <span>Focus</span>
                <b>Front &amp; Back End</b>
              </div>
              <div>
                <span>Stack</span>
                <b>MERN + 6 languages</b>
              </div>
              <div>
                <span>Status</span>
                <b>Open to work</b>
              </div>
              <div>
                <span>Education</span>
                <b>IT Undergraduate</b>
              </div>
              <div>
                <span>Location</span>
                <b className="about-meta-placeholder">Add your city</b>
              </div>
            </div>

            <div className="about-card-actions">
              <a href="#contact" className="about-card-cta">
                Let&apos;s talk →
              </a>
              <DownloadCV variant="about" />
            </div>
          </div>
        </div>

        {/* Intro column */}
        <div className="about-body reveal-up">
          <div className="kicker">ABOUT</div>
          <h2 className="title" id="about-heading">
            A developer who enjoys turning ideas into practical digital solutions.
          </h2>
          <p>
            Motivated and passionate IT undergraduate and aspiring full-stack developer with a
            strong interest in designing and developing modern, responsive, and user-friendly
            web applications.
          </p>
          <p>
            I&apos;ve built a growing foundation in HTML, CSS, JavaScript, databases, and
            programming, with a real passion for learning new technologies and solving
            real-world problems. I&apos;m creative, adaptable, and detail-oriented — eager to
            grow as a professional full-stack developer.
          </p>

          <div className="about-facts">
            <div className="about-fact">
              <span className="about-fact-label">Education</span>
              <span className="about-fact-value">IT Undergraduate</span>
              <span className="about-fact-note">Institution details can be added here</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">Tech focus</span>
              <span className="about-fact-value">MERN · PHP / Laravel · Firebase</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-label">Current status</span>
              <span className="about-fact-value">
                <span className="dot-live" /> Available for opportunities
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-inner">
        <div className="about-highlights reveal-up">
          <div className="ah-item">
            <div className="ah-tag">FRONTEND</div>
            <div className="ah-title">Interfaces that feel right</div>
            <p>
              Responsive, accessible layouts built with HTML, CSS, JavaScript and React —
              designed mobile-first and tuned for real users.
            </p>
          </div>
          <div className="ah-item">
            <div className="ah-tag">BACKEND</div>
            <div className="ah-title">Logic that holds up</div>
            <p>
              APIs and data models with Node.js, Express, PHP/Laravel and Firebase — built to
              stay simple to maintain and easy to scale.
            </p>
          </div>
          <div className="ah-item">
            <div className="ah-tag">FULL-STACK</div>
            <div className="ah-title">Connected, end to end</div>
            <p>
              Comfortable owning a feature from database to UI with the MERN stack, so nothing
              gets lost between the two ends.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
