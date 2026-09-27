import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false
function ensureGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches
}

/**
 * Reveal an element safely (always ends visible).
 */
function revealEl(el, { duration = 0.65, y = 28, delay = 0 } = {}) {
  if (!el || el.dataset.motionDone === '1') return
  el.dataset.motionDone = '1'
  gsap.fromTo(
    el,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => {
        el.classList.add('in')
        gsap.set(el, { clearProps: 'transform,opacity' })
      },
    }
  )
}

/**
 * Premium scroll + entrance motion.
 * Fail-safe: if GSAP/ScrollTrigger never fires, content stays visible
 * (CSS defaults to opacity:1 unless html.js-motion-ready is set).
 */
export default function usePremiumMotion(enabled) {
  useEffect(() => {
    if (!enabled) return

    const reduced = prefersReducedMotion()
    const root = document.getElementById('main-content') || document.body

    const markAllVisible = () => {
      document.querySelectorAll('.reveal-up, .pc-card, .sk-card, .interest-card, .ah-item, .tech-item, .contact-detail-card').forEach((el) => {
        el.classList.add('in')
        el.dataset.motionDone = '1'
        if (el.style) {
          el.style.opacity = ''
          el.style.transform = ''
        }
      })
      document.documentElement.classList.remove('js-motion-ready')
    }

    if (reduced) {
      markAllVisible()
      return
    }

    ensureGsap()
    // Only hide unrevealed elements after GSAP is confirmed ready
    document.documentElement.classList.add('js-motion-ready')

    const wired = new WeakSet()
    const triggers = []

    function wireReveal(el) {
      if (!el || wired.has(el) || el.dataset.motionDone === '1') return
      wired.add(el)

      // If already in (or near) viewport, reveal immediately — do not wait forever
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 800
      if (rect.top < vh * 0.92 && rect.bottom > 0) {
        revealEl(el, { duration: 0.5, y: 18 })
        return
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => revealEl(el),
        // Safety: if trigger never enters for any reason, show after first refresh cycle
      })
      triggers.push(st)
    }

    function wireAll() {
      document.querySelectorAll('.reveal-up').forEach(wireReveal)
    }

    const ctx = gsap.context(() => {
      // Hero entrance (does not leave opacity stuck)
      const heroCopy = document.querySelector('#hero .hero-copy')
      if (heroCopy) {
        const parts = heroCopy.querySelectorAll(
          '.hero-eyebrow, .hero-kicker, .hero-title, .hero-desc, .hero-cta, .hero-stats'
        )
        gsap.fromTo(
          parts,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
          }
        )
      }

      wireAll()

      // Stagger groups — only enhance; never leave permanent opacity 0
      const staggerGroups = [
        '.sk-grid .sk-card',
        '.pc-grid .pc-card',
        '.interest-grid .interest-card',
        '.about-highlights .ah-item',
        '.tech-grid .tech-item',
        '.contact-details-grid .contact-detail-card',
      ]

      staggerGroups.forEach((sel) => {
        const items = gsap.utils.toArray(sel)
        items.forEach((el, i) => {
          if (!el || wired.has(el) || el.dataset.motionDone === '1') return
          wired.add(el)
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight || 800
          if (rect.top < vh * 0.95 && rect.bottom > 0) {
            revealEl(el, { duration: 0.5, y: 16, delay: i * 0.06 })
            return
          }
          const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => revealEl(el, { duration: 0.55, y: 16, delay: 0 }),
          })
          triggers.push(st)
        })
      })

      if (!isMobile()) {
        const photo = document.querySelector('.about-photo-frame')
        if (photo) {
          gsap.to(photo, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: '#about',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
        }
      }

      const nav = document.querySelector('header.nav')
      if (nav) {
        ScrollTrigger.create({
          start: 40,
          onUpdate: (self) => {
            if (self.scroll() > 40) nav.classList.add('nav-scrolled')
            else nav.classList.remove('nav-scrolled')
          },
        })
      }
    })

    // Late-mounted nodes (lazy Projects, etc.)
    let mo
    if (typeof MutationObserver !== 'undefined' && root) {
      let scheduled = false
      mo = new MutationObserver(() => {
        if (scheduled) return
        scheduled = true
        setTimeout(() => {
          scheduled = false
          wireAll()
          // Also wire project cards specifically
          document.querySelectorAll('.pc-grid .pc-card').forEach((el, i) => {
            if (wired.has(el) || el.dataset.motionDone === '1') return
            wired.add(el)
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight || 800
            if (rect.top < vh * 0.95 && rect.bottom > 0) {
              revealEl(el, { duration: 0.5, y: 16, delay: i * 0.05 })
            } else {
              const st = ScrollTrigger.create({
                trigger: el,
                start: 'top 92%',
                once: true,
                onEnter: () => revealEl(el),
              })
              triggers.push(st)
            }
          })
          try {
            ScrollTrigger.refresh()
          } catch {
            /* ignore */
          }
        }, 50)
      })
      mo.observe(root, { childList: true, subtree: true })
    }

    const timers = [300, 1000, 2000].map((ms) =>
      setTimeout(() => {
        wireAll()
        document.querySelectorAll('.pc-grid .pc-card').forEach((el) => {
          if (el.dataset.motionDone === '1') return
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight || 800
          // Absolute safety net: if element is on-screen and still not revealed, force show
          if (rect.top < vh && rect.bottom > 0) {
            el.classList.add('in')
            el.dataset.motionDone = '1'
            gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,opacity' })
          }
        })
        try {
          ScrollTrigger.refresh()
        } catch {
          /* ignore */
        }
      }, ms)
    )

    // Global safety: after 4s, force-show anything still hidden by motion
    const failSafe = setTimeout(() => {
      document.querySelectorAll('.reveal-up:not(.in), .pc-card').forEach((el) => {
        if (el.dataset.motionDone === '1' && el.classList.contains('in')) return
        el.classList.add('in')
        el.dataset.motionDone = '1'
        try {
          gsap.set(el, { opacity: 1, y: 0, clearProps: 'transform,opacity' })
        } catch {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }
      })
    }, 4000)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(failSafe)
      mo?.disconnect()
      document.documentElement.classList.remove('js-motion-ready')
      ctx.revert()
    }
  }, [enabled])
}
