const INTERESTS = [
  { index: 'A', name: 'Exploring new tech' },
  { index: 'B', name: 'Reading about the web' },
  { index: 'C', name: 'UI & UX' },
  { index: 'D', name: 'Sports' },
]

export default function Interests() {
  return (
    <section id="interests" aria-labelledby="interests-heading">
      <div className="section-inner">
        <div className="kicker reveal-up">INTERESTS</div>
        <h2 className="title reveal-up" id="interests-heading">What keeps me curious.</h2>
        <div className="interest-grid reveal-up">
          {INTERESTS.map((i) => (
            <div className="interest-card" key={i.index}>
              <span className="i-index">{i.index}</span>
              <div className="i-name">{i.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
