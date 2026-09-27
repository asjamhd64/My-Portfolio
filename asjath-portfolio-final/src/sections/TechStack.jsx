const TECHS = [
  { name: 'HTML', tag: 'Markup', level: 0.9 },
  { name: 'CSS', tag: 'Styling', level: 0.88 },
  { name: 'JavaScript', tag: 'Scripting', level: 0.82 },
  { name: 'PHP', tag: 'Backend', level: 0.72 },
  { name: 'Python', tag: 'General purpose', level: 0.65 },
  { name: 'Java', tag: 'General purpose', level: 0.6 },
]

const FRAMEWORKS = [
  { name: 'React', tag: 'Frontend · M-E-R-N', level: 0.75 },
  { name: 'Node.js', tag: 'Runtime · M-E-R-N', level: 0.72 },
  { name: 'Express.js', tag: 'Backend · M-E-R-N', level: 0.7 },
  { name: 'MongoDB', tag: 'Database · M-E-R-N', level: 0.68 },
  { name: 'Laravel', tag: 'Backend framework', level: 0.72 },
  { name: 'Firebase', tag: 'Backend / DB', level: 0.7 },
]

function TechItem({ name, tag, level }) {
  const pct = Math.round(level * 100)
  return (
    <div className="tech-item">
      <div className="t-name" id={`tech-${name.replace(/\W/g, '')}`}>
        {name}
      </div>
      <div className="t-tag">{tag}</div>
      <div
        className="tech-bar"
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`tech-${name.replace(/\W/g, '')}`}
        aria-label={`${name} relative experience indicator`}
      >
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function TechStack() {
  return (
    <section id="stack" aria-labelledby="stack-title">
      <div className="section-inner">
        <div className="kicker reveal-up">LANGUAGES</div>
        <h2 className="title reveal-up" id="stack-title">
          Languages I build with.
        </h2>
        <div className="tech-grid reveal-up" id="techGrid">
          {TECHS.map((t) => (
            <TechItem key={t.name} {...t} />
          ))}
        </div>

        <div className="kicker reveal-up" style={{ marginTop: 64 }}>
          FULL-STACK TOOLKIT
        </div>
        <h2 className="title reveal-up" id="framework-title">
          MERN, plus the frameworks I build with.
        </h2>
        <div className="tech-grid reveal-up" id="frameworkGrid" aria-labelledby="framework-title">
          {FRAMEWORKS.map((t) => (
            <TechItem key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  )
}
