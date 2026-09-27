import { useEffect, useState } from 'react'
import DownloadCV from '../components/DownloadCV'

export default function Hero({ showVideo: _showVideo }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section
      id="hero"
      className={entered ? 'hero-entered' : ''}
      aria-label="Introduction"
    >
      <div className="section-inner hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="dot" /> Available for opportunities
          </div>
          <p className="hero-kicker">FULL-STACK DEVELOPER</p>
          <h1 className="hero-title">
            ASJATH
            <br />
            <span className="grad">MUBEEN</span>
          </h1>
          <p className="hero-desc">
            IT undergraduate crafting clean, responsive web products — from polished
            storefronts to reliable admin systems. I care about usable interfaces and
            solid engineering end to end.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn btn-ghost">
              Get in Touch
            </a>
            <DownloadCV variant="ghost" />
          </div>
          <div className="hero-stats">
            <div className="stat">
              <b>2</b>
              <span>Live projects</span>
            </div>
            <div className="stat">
              <b>7+</b>
              <span>Technologies</span>
            </div>
            <div className="stat">
              <b>MERN</b>
              <span>+ 6 languages</span>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-inner">
            <div className="hero-glow hero-glow-main" />
            <div className="hero-glow hero-glow-soft" />
            <div className="hero-deco hero-deco-ring" />
            <div className="hero-deco hero-deco-line" />
            <div className="hero-deco hero-deco-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
