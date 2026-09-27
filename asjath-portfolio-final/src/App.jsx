import { useState, useCallback, useEffect } from 'react'
import Loader from './components/Loader'
import Welcome from './components/Welcome'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import TechStack from './sections/TechStack'
import Interests from './sections/Interests'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import Aurora from './components/Aurora'
import usePremiumMotion from './hooks/usePremiumMotion'

const INTRO_KEY = 'asjath_intro_done'

/**
 * Intro skip rules:
 * - Development (npm run dev): ALWAYS show loader + welcome on every full page load.
 *   sessionStorage is cleared so an old "done" flag cannot hide the intro.
 * - Production build: after the user finishes or skips once, skip intro on later visits
 *   in the same tab session.
 */
function shouldPlayIntro() {
  if (import.meta.env.DEV) {
    try {
      sessionStorage.removeItem(INTRO_KEY)
    } catch {
      /* ignore */
    }
    return true
  }
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1'
  } catch {
    return true
  }
}

function markIntroDone() {
  if (import.meta.env.DEV) return // do not persist skip in development
  try {
    sessionStorage.setItem(INTRO_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [phase, setPhase] = useState(() => (shouldPlayIntro() ? 'loading' : 'site'))
  const [siteRevealed, setSiteRevealed] = useState(() => !shouldPlayIntro())

  usePremiumMotion(siteRevealed)

  useEffect(() => {
    if (phase === 'site' && !siteRevealed) {
      const t = setTimeout(() => setSiteRevealed(true), 50)
      return () => clearTimeout(t)
    }
  }, [phase, siteRevealed])

  const handleLoaderDone = useCallback(() => {
    setPhase('welcome')
  }, [])

  const handleWelcomeDone = useCallback(() => {
    markIntroDone()
    setPhase('site')
  }, [])

  const handleSkipAll = useCallback(() => {
    markIntroDone()
    setPhase('site')
    setSiteRevealed(true)
  }, [])

  const introActive = phase === 'loading' || phase === 'welcome'

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          if (introActive) {
            e.preventDefault()
            handleSkipAll()
            requestAnimationFrame(() => {
              document.getElementById('main-content')?.focus()
            })
          }
        }}
      >
        Skip to content
      </a>
      <Aurora />
      {phase === 'loading' && (
        <Loader onDone={handleLoaderDone} onSkip={handleSkipAll} />
      )}
      {phase === 'welcome' && (
        <Welcome onDone={handleWelcomeDone} onSkip={handleSkipAll} />
      )}
      <main
        id="site"
        className={siteRevealed ? 'reveal' : ''}
        aria-hidden={introActive ? true : undefined}
      >
        <Navbar />
        <div id="main-content" tabIndex={-1}>
          <Hero showVideo={siteRevealed} />
          <About />
          <Skills />
          <TechStack />
          <Projects />
          <Interests />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  )
}
