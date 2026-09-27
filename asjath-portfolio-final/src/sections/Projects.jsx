import { useEffect, useRef, useState } from 'react'

/**
 * Project link config.
 * Set a real URL string when available. Leave as null until then —
 * the UI shows a disabled control labeled “Coming soon” (never href="#").
 *
 * liveUrl / githubUrl / caseStudyUrl:
 *   string → working button (opens in new tab with noopener)
 *   null   → disabled placeholder (no navigation)
 */
const PROJECTS = [
  {
    id: 'flexwear',
    name: 'FlexWear Fashion Store',
    category: 'E-commerce · Fashion',
    description:
      'A modern online fashion shopping platform built for a smooth, convenient way to discover and buy clothing. Includes browsing, categories, search & filtering, product details, cart, checkout, and order management — designed to feel clean and stylish across desktop and mobile.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
    features: [
      'Product browse, categories & search',
      'Cart, checkout & order flow',
      'Responsive fashion-focused UI',
      'Firebase-backed data',
    ],
    preview: 'fashion',
    // TODO: replace with real URLs when available
    liveUrl: null, // e.g. 'https://your-flexwear-demo.example'
    githubUrl: null, // e.g. 'https://github.com/youruser/flexwear'
    caseStudyUrl: null,
  },
  {
    id: 'almas',
    name: "Alma's Kitchen Website",
    category: 'E-commerce · Kitchenware',
    description:
      'An e-commerce site for kitchen and home appliances — cookware, glassware, fans, chairs and more. Customers browse, search, filter and check out via cash on delivery or bank transfer, while an admin panel handles products, orders, payments and customers.',
    tech: ['PHP', 'Laravel', 'MySQL'],
    features: [
      'Catalog, search & filters',
      'COD & bank transfer checkout',
      'Admin: products, orders, customers',
      'Live storefront preview',
    ],
    preview: 'live',
    // Local full-preview asset shipped with the portfolio
    liveUrl: '/almas.html',
    // TODO: replace with real GitHub URL when available
    githubUrl: null, // e.g. 'https://github.com/youruser/almas-kitchen'
    caseStudyUrl: null,
  },
]

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url)
}

/**
 * Renders a real <a> when href is a non-empty string, otherwise a disabled <button>.
 * Never uses href="#".
 */
function ProjectAction({ href, variant = 'ghost', label, icon, title }) {
  const hasUrl = typeof href === 'string' && href.trim().length > 0
  const className = `pc-btn pc-btn-${variant}${hasUrl ? '' : ' is-disabled'}`

  if (!hasUrl) {
    return (
      <button
        type="button"
        className={className}
        disabled
        title={title || `${label} — URL not configured yet`}
        aria-label={`${label} (coming soon)`}
      >
        {icon}
        <span>{label}</span>
        <span className="pc-btn-soon">Soon</span>
      </button>
    )
  }

  const external = isExternalUrl(href)

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title || label}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
      {external && (
        <span className="pc-btn-ext" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  )
}

const IconExternal = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const IconGithub = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const IconDoc = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

function AlmasPreview() {
  const frameRef = useRef(null)
  const wrapRef = useRef(null)
  const rootRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShouldLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '240px', threshold: 0.01 }
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return
    const frame = frameRef.current
    const wrap = wrapRef.current
    if (!frame || !wrap) return
    if (!frame.src) frame.src = '/almas.html'
    function fit() {
      const scale = wrap.clientWidth / 1440
      frame.style.transform = `scale(${scale})`
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [shouldLoad])

  return (
    <div className="pc-preview pc-preview-live" ref={rootRef}>
      <div className="browser-chrome">
        <span />
        <span />
        <span />
        <div className="chrome-url">almaskitchen.lk</div>
      </div>
      <div className="iframe-wrap" ref={wrapRef}>
        <iframe
          ref={frameRef}
          className="live-frame"
          loading="lazy"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          title="Alma's Kitchen — live preview"
          width="1440"
          height="900"
        />
      </div>
    </div>
  )
}

function FashionPreview() {
  return (
    <div className="pc-preview pc-preview-fashion" aria-hidden="true">
      <div className="pc-preview-pattern" />
      <div className="pc-preview-overlay">
        <span className="pc-preview-badge">Fashion Store</span>
      </div>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="pc-card">
      <div className="pc-media">
        {project.preview === 'live' ? <AlmasPreview /> : <FashionPreview />}
        <div className="pc-media-fade" />
      </div>

      <div className="pc-body">
        <div className="pc-meta">
          <span className="pc-category">{project.category}</span>
        </div>
        <h3 className="pc-title">{project.name}</h3>
        <p className="pc-desc">{project.description}</p>

        <div className="pc-features">
          <div className="pc-features-label">Key features</div>
          <ul>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="pc-tech">
          {project.tech.map((t) => (
            <span key={t} className="pc-tech-pill">
              {t}
            </span>
          ))}
        </div>

        <div className="pc-actions">
          <ProjectAction
            href={project.liveUrl}
            variant="primary"
            label="Live Demo"
            icon={IconExternal}
            title={project.liveUrl ? 'Open live demo' : 'Live demo URL not configured yet'}
          />
          <ProjectAction
            href={project.githubUrl}
            variant="ghost"
            label="GitHub"
            icon={IconGithub}
            title={project.githubUrl ? 'View source on GitHub' : 'GitHub URL not configured yet'}
          />
          {/* Case Study only renders when a real URL is set */}
          {typeof project.caseStudyUrl === 'string' && project.caseStudyUrl.trim() && (
            <ProjectAction
              href={project.caseStudyUrl}
              variant="ghost"
              label="Case Study"
              icon={IconDoc}
              title="Read case study"
            />
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <div className="section-inner">
        <div className="kicker reveal-up">PROJECTS</div>
        <h2 className="title reveal-up" id="projects-heading">A couple of things I&apos;ve built.</h2>
        <p className="lede reveal-up projects-lede">
          Selected work — product thinking, clean UI, and full-stack delivery.
        </p>
        <div className="pc-grid">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
