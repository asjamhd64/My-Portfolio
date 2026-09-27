import { useEffect, useRef, useState, useMemo } from 'react'

const STATUS_STEPS = [
  { at: 0, text: 'INITIALIZING...' },
  { at: 18, text: 'LOADING ASSETS...' },
  { at: 42, text: 'PREPARING 3D EXPERIENCE...' },
  { at: 68, text: 'LOADING PORTFOLIO...' },
  { at: 92, text: 'READY.' },
]

function useReduceMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener?.('change', fn)
    return () => mq.removeEventListener?.('change', fn)
  }, [])
  return reduced
}

function statusFor(pct) {
  let text = STATUS_STEPS[0].text
  for (const step of STATUS_STEPS) {
    if (pct >= step.at) text = step.text
  }
  return text
}

function ambientParticles(canvasEl, { count, reduceMotion }) {
  const ctx = canvasEl.getContext('2d')
  let W = 0
  let H = 0
  const particles = []
  let raf = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = canvasEl.width = canvasEl.offsetWidth * dpr
    H = canvasEl.height = canvasEl.offsetHeight * dpr
  }
  resize()
  window.addEventListener('resize', resize)

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.3,
      s: Math.random() * 0.45 + 0.05,
      o: Math.random() * 0.45 + 0.12,
      p: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.00015,
    })
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    // soft vignette wash
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.4, W * 0.55)
    g.addColorStop(0, 'rgba(109,40,217,0.04)')
    g.addColorStop(0.5, 'rgba(124,58,237,0.03)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)

    particles.forEach((pt) => {
      pt.p += 0.0035 * pt.s
      pt.x = (pt.x + pt.drift + 1) % 1
      const y = (pt.y + Math.sin(pt.p) * 0.025) * H
      const x = pt.x * W
      const glow = (Math.sin(pt.p * 2) + 1) / 2
      const alpha = pt.o * 0.55 + glow * 0.22
      ctx.beginPath()
      ctx.fillStyle = `rgba(109,40,217,${alpha})`
      ctx.arc(x, y, pt.r * (window.devicePixelRatio || 1), 0, Math.PI * 2)
      ctx.fill()
    })
    raf = requestAnimationFrame(draw)
  }

  if (!reduceMotion) draw()

  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function Loader({ onDone, onSkip }) {
  const canvasRef = useRef(null)
  const [pct, setPct] = useState(1)
  const [displayPct, setDisplayPct] = useState(1)
  const [fading, setFading] = useState(false)
  const [statusVisible, setStatusVisible] = useState(true)
  const reduceMotion = useReduceMotion()
  const status = useMemo(() => statusFor(pct), [pct])
  const prevStatus = useRef(status)

  // Crossfade status text when it changes
  useEffect(() => {
    if (prevStatus.current !== status) {
      setStatusVisible(false)
      const t = setTimeout(() => {
        prevStatus.current = status
        setStatusVisible(true)
      }, 120)
      return () => clearTimeout(t)
    }
  }, [status])

  // Smooth displayed percentage (slight lag for premium feel)
  useEffect(() => {
    if (reduceMotion) {
      setDisplayPct(pct)
      return
    }
    let raf
    const tick = () => {
      setDisplayPct((d) => {
        const diff = pct - d
        if (Math.abs(diff) < 0.15) return pct
        return d + diff * 0.18
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pct, reduceMotion])

  useEffect(() => {
    const isMobile = window.innerWidth < 700
    const stop = ambientParticles(canvasRef.current, {
      count: isMobile ? 28 : 64,
      reduceMotion,
    })

    // Fast but polished: ~2.2s normal, ~0.45s reduced
    const duration = reduceMotion ? 450 : 2200
    let start = null
    let rafId

    function tick(ts) {
      if (!start) start = ts
      const elapsed = ts - start
      const t = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(t)
      const p = Math.max(1, Math.round(eased * 100))
      setPct(p)
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setPct(100)
        // Brief hold on READY, then blur/fade — no flash
        setTimeout(() => {
          setFading(true)
          stop()
          setTimeout(() => onDone(), 900)
        }, reduceMotion ? 120 : 320)
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      stop()
    }
  }, [onDone, reduceMotion])

  const shown = Math.max(1, Math.round(displayPct))
  const pctLabel = shown < 10 ? `0${shown}` : `${shown}`
  const barWidth = `${Math.min(100, displayPct)}%`

  return (
    <>
      <div
        id="loader"
        className={fading ? 'fade-out' : ''}
        aria-busy="true"
        aria-live="polite"
      >
        <canvas id="loader-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="loader-inner">
          <div className="loader-mark">
            <span className="loader-mark-name">ASJATH MUBEEN</span>
            <span className="loader-mark-role">FULL-STACK DEVELOPER</span>
          </div>

          <div className="loader-pct" id="pct">
            <span className="loader-pct-num">{pctLabel}</span>
            <span className="loader-pct-sym">%</span>
          </div>

          <div className="loader-bar" role="progressbar" aria-valuenow={shown} aria-valuemin={0} aria-valuemax={100}>
            <div className="loader-bar-track" />
            <div className="loader-bar-fill" id="loaderBarFill" style={{ width: barWidth }}>
              <span className="loader-bar-glow" />
            </div>
          </div>

          <div
            className={`loader-caption${statusVisible ? ' is-visible' : ''}`}
            key={prevStatus.current}
          >
            {statusVisible ? status : prevStatus.current}
          </div>
        </div>
      </div>
      <button id="skip-intro" type="button" aria-label="Skip intro" onClick={onSkip}>
        Skip intro
      </button>
    </>
  )
}
