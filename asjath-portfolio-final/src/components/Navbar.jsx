import { useState, useEffect, useRef, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#stack', label: 'Stack' },
  { href: '#projects', label: 'Projects' },
  { href: '#interests', label: 'Interests' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)
  const menuId = useId()

  useEffect(() => setMounted(true), [])

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Body scroll lock
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [open])

  // Escape + focus trap
  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled])'
        )
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLinkRef.current?.focus(), 60)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open])

  // Close when switching to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860 && open) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open])

  const onNavClick = (e, href) => {
    e.preventDefault()
    setOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    const scroll = () => {
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        try {
          history.pushState(null, '', href)
        } catch {
          /* ignore */
        }
      }
    }
    // Wait a frame so body unlock doesn't cancel smooth scroll on iOS
    requestAnimationFrame(() => setTimeout(scroll, 20))
  }

  const mobileMenu =
    mounted &&
    createPortal(
      <>
        <div
          className={`nav-backdrop${open ? ' is-visible' : ''}`}
          onClick={close}
          aria-hidden="true"
        />
        <nav
          id={menuId}
          ref={panelRef}
          className={`nav-panel${open ? ' is-open' : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!open}
        >
          <div className="nav-panel-inner">
            <div className="nav-panel-label">Navigate</div>
            <ul className="nav-panel-list">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href}>
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    onClick={(e) => onNavClick(e, l.href)}
                  >
                    <span className="nav-panel-index">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </>,
      document.body
    )

  return (
    <>
      <header className={`nav${open ? ' nav-open' : ''}`}>
        <a
          href="#hero"
          className="brand"
          onClick={(e) => onNavClick(e, '#hero')}
        >
          <span className="brand-name">Mohamed</span> Asjath
        </a>

        <nav className="links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => onNavClick(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`nav-toggle${open ? ' is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={toggle}
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>
      </header>
      {mobileMenu}
    </>
  )
}
