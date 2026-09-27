import { useEffect } from 'react'

export default function useScrollReveal(enabled) {
  useEffect(() => {
    if (!enabled) return
    const revealEls = document.querySelectorAll('.reveal-up')
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          })
        },
        { threshold: 0.15 }
      )
      revealEls.forEach((el) => io.observe(el))
      return () => io.disconnect()
    } else {
      revealEls.forEach((el) => el.classList.add('in'))
    }
  }, [enabled])
}
