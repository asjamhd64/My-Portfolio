/**
 * Descriptive levels only — not precise % scores.
 * levelDots: 1–4 for subtle visual weight (Learning → Strong Foundation)
 */
const LEVELS = {
  learning: { label: 'Learning', dots: 1 },
  familiar: { label: 'Familiar', dots: 2 },
  working: { label: 'Working Knowledge', dots: 3 },
  strong: { label: 'Strong Foundation', dots: 4 },
}

const CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'Interfaces and interaction',
    skills: [
      { name: 'HTML', level: 'strong', icon: 'html' },
      { name: 'CSS', level: 'strong', icon: 'css' },
      { name: 'JavaScript', level: 'working', icon: 'js' },
      { name: 'React', level: 'working', icon: 'react' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    blurb: 'APIs and application logic',
    skills: [
      { name: 'Node.js', level: 'working', icon: 'node' },
      { name: 'Express.js', level: 'working', icon: 'express' },
      { name: 'PHP', level: 'working', icon: 'php' },
      { name: 'Laravel', level: 'working', icon: 'laravel' },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    blurb: 'Data models and storage',
    skills: [
      { name: 'MongoDB', level: 'familiar', icon: 'mongo' },
      { name: 'MySQL', level: 'working', icon: 'mysql' },
      { name: 'Firebase', level: 'working', icon: 'firebase' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools / Other',
    blurb: 'Workflow and craft',
    skills: [
      { name: 'Git', level: 'working', icon: 'git' },
      { name: 'GitHub', level: 'working', icon: 'github' },
      { name: 'UI/UX', level: 'familiar', icon: 'uiux' },
      { name: 'Problem Solving', level: 'strong', icon: 'solve' },
    ],
  },
]

function SkillIcon({ type }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (type) {
    case 'html':
      return (
        <svg {...common}>
          <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3z" />
          <path d="M8 8h8l-.4 5H9.2l.2 2.5L12 16.5l2.5-.7.2-2H12" />
        </svg>
      )
    case 'css':
      return (
        <svg {...common}>
          <path d="M4 3h16l-1.5 17L12 22l-6.5-2L4 3z" />
          <path d="M8 9h7.5l-.3 3H9.5l.2 2h5.2l-.4 3.5L12 18.5 9.2 17.5" />
        </svg>
      )
    case 'js':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M10 9v7.5c0 1.2-.4 2-1.6 2-1 0-1.5-.5-1.9-1.2M14 15.5c.4.8 1 1.3 2 1.3 1.2 0 2-.6 2-1.7 0-1.2-.8-1.6-2.1-2.1l-.7-.3c-1.3-.5-2.2-1.3-2.2-2.9 0-1.6 1.2-2.8 3-2.8 1.3 0 2.2.5 2.8 1.5" />
        </svg>
      )
    case 'react':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        </svg>
      )
    case 'node':
      return (
        <svg {...common}>
          <path d="M12 2 3.5 7v10L12 22l8.5-5V7L12 2z" />
          <path d="M12 22V12M3.5 7 12 12l8.5-5" />
        </svg>
      )
    case 'express':
      return (
        <svg {...common}>
          <path d="M4 8h10M4 12h16M4 16h10" />
        </svg>
      )
    case 'php':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="9" ry="6" />
          <path d="M7 12h2.5c.8 0 1.5-.4 1.5-1.2S10 9.6 9.2 9.6H8.2v4.8M14 9.6v4.8M14 12h2" />
        </svg>
      )
    case 'laravel':
      return (
        <svg {...common}>
          <path d="M4 8 8 4l4 4-4 4-4-4zM12 8l4-4 4 4-4 4-4-4zM8 12l4 4 4-4" />
        </svg>
      )
    case 'mongo':
      return (
        <svg {...common}>
          <path d="M12 3c2 3 4 6 4 18-4-12-2-15 0-18z" />
          <path d="M12 7c2 2 3 5 0 12" />
        </svg>
      )
    case 'mysql':
      return (
        <svg {...common}>
          <path d="M4 14c2-4 6-6 10-6s6 1 6 3-2 3-6 3H9" />
          <path d="M8 17c0 1.5 2 2.5 4 2.5s3-.5 3-1.5" />
          <circle cx="7" cy="11" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'firebase':
      return (
        <svg {...common}>
          <path d="M5 18 8 6l3 5 2-8 6 15H5z" />
        </svg>
      )
    case 'git':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="M6 8v4c0 2 2 4 6 4M18 8v2" />
        </svg>
      )
    case 'github':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      )
    case 'uiux':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 9h18M8 14h3" />
        </svg>
      )
    case 'solve':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 10a3 3 0 1 1 4.5 2.5c-.8.6-1.5 1.2-1.5 2.5M12 18h.01" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

function LevelDots({ count }) {
  return (
    <div className="sk-dots" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className={i <= count ? 'on' : ''} />
      ))}
    </div>
  )
}

function SkillCard({ skill }) {
  const meta = LEVELS[skill.level] || LEVELS.familiar
  return (
    <div className="sk-card">
      <div className="sk-card-top">
        <div className="sk-icon">
          <SkillIcon type={skill.icon} />
        </div>
        <div className="sk-card-text">
          <div className="sk-name">{skill.name}</div>
          <div className="sk-level">{meta.label}</div>
        </div>
      </div>
      <LevelDots count={meta.dots} />
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div className="section-inner">
        <div className="kicker reveal-up">SKILLS</div>
        <h2 className="title reveal-up" id="skills-heading">Tools and technologies I work with.</h2>
        <p className="lede reveal-up">
          A practical stack across frontend, backend, and data — with honest, descriptive
          levels rather than score-style percentages.
        </p>

        <div className="sk-categories">
          {CATEGORIES.map((cat) => (
            <div className="sk-category reveal-up" key={cat.id}>
              <div className="sk-cat-head">
                <h3 className="sk-cat-title">{cat.title}</h3>
                <span className="sk-cat-blurb">{cat.blurb}</span>
              </div>
              <div className="sk-grid">
                {cat.skills.map((s) => (
                  <SkillCard key={s.name} skill={s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
