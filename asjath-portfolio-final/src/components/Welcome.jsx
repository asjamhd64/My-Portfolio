import { useEffect, useRef, useState } from 'react'
import WelcomeScene from './welcome/WelcomeScene'

function useReduceMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

/**
 * After loader:
 * idle 3D character → wave → "WELCOME TO MY PROFILE" → "FULL-STACK DEVELOPER" → exit
 */
export default function Welcome({ onDone, onSkip }) {
  const [exiting, setExiting] = useState(false)
  const [charPhase, setCharPhase] = useState('idle')
  const [showTitle, setShowTitle] = useState(false)
  const [showSub, setShowSub] = useState(false)
  const exitedRef = useRef(false)
  const reduceMotion = useReduceMotion()

  useEffect(() => {
    const timers = []

    function exit() {
      if (exitedRef.current) return
      exitedRef.current = true
      setExiting(true)
      setTimeout(() => onDone(), 900)
    }

    if (reduceMotion) {
      timers.push(setTimeout(() => setShowTitle(true), 200))
      timers.push(setTimeout(() => setShowSub(true), 500))
      timers.push(setTimeout(exit, 2400))
      return () => timers.forEach(clearTimeout)
    }

    timers.push(setTimeout(() => setCharPhase('wave'), 1100))
    timers.push(setTimeout(() => setCharPhase('hold'), 2700))
    timers.push(setTimeout(() => setShowTitle(true), 2000))
    timers.push(setTimeout(() => setShowSub(true), 2800))
    timers.push(setTimeout(exit, 5600))

    return () => timers.forEach(clearTimeout)
  }, [onDone, reduceMotion])

  const handleSkip = () => {
    if (exitedRef.current) return
    exitedRef.current = true
    onSkip()
  }

  return (
    <>
      <div
        id="welcome"
        role="dialog"
        aria-label="Welcome introduction"
        aria-modal="true"
        className={`welcome-stage${exiting ? ' is-exiting' : ''}`}
      >
        <div className="welcome-scene-layer">
          <WelcomeScene phase={charPhase} reducedMotion={reduceMotion} />
        </div>
        <div className="welcome-vignette" aria-hidden="true" />
        <div className="welcome-text">
          <div className={`welcome-line welcome-line-main${showTitle ? ' show' : ''}`}>
            WELCOME TO MY PROFILE
          </div>
          <div className={`welcome-line sub${showSub ? ' show' : ''}`}>
            FULL-STACK DEVELOPER
          </div>
        </div>
      </div>
      <button id="skip-intro" type="button" aria-label="Skip intro" onClick={handleSkip}>
        Skip intro
      </button>
    </>
  )
}
