import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="heritage-hero" style={{ padding: '80px 24px 72px' }}>
        <div className="heritage-pattern" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(193,127,60,0.2)', border: '1px solid rgba(193,127,60,0.4)', padding: '6px 16px', borderRadius: 20, marginBottom: 24 }}>
            <span style={{ color: '#f5c678', fontSize: 13, fontWeight: 600 }}>Gujarat Hackathon 2026</span>
            <span className="demo-badge">DEMO</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 20, color: '#f7f0e6', maxWidth: 700, margin: '0 auto 20px' }}>
            Protect Gujarat's Heritage<br />with Agentic AI
          </h1>
          <p style={{ fontSize: 18, color: '#c8b89a', marginBottom: 36, maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Intelligent visitor management, personalised heritage experiences, and conservation decision support for Modhera Sun Temple and Ahmedabad Walled City.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/visitor/guide">
              <button className="btn btn-primary btn-lg" style={{ background: '#c17f3c', fontSize: 16 }}>
                ✦ Explore Heritage
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn btn-secondary btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: 16 }}>
                Open Conservation Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sites */}
      <section style={{ padding: '64px 24px', background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Gujarat's Protected Heritage Sites</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>Two of India's most significant heritage destinations</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>☀</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Modhera Sun Temple</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Mehsana District, Gujarat · c. 1026 CE</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16, color: 'var(--text)' }}>
                Masterpiece of Solanki (Chaulukya) architecture dedicated to the Sun God. Features the iconic Surya Kund step-well and the ornate Sabha Mandap. Protected by the Archaeological Survey of India.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {['Architecture', 'ASI Protected', 'UNESCO Tentative', 'Solanki'].map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
              <Link to="/visitor/guide">
                <button className="btn btn-primary btn-sm">Plan Your Visit</button>
              </Link>
            </div>
            <div className="card">
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏙</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ahmedabad Walled City</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Ahmedabad, Gujarat · Founded 1411 CE</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 16, color: 'var(--text)' }}>
                India's first UNESCO World Heritage City. A living tapestry of historic pols, havelis, mosques, and temples representing six centuries of Hindu-Muslim-Jain coexistence.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                {['UNESCO World Heritage', 'Living City', 'Pols', 'Multi-cultural'].map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
              <Link to="/visitor/guide">
                <button className="btn btn-primary btn-sm">Plan Your Visit</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section style={{ padding: '64px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Five Specialised AI Agents</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>Coordinated by the Heritage Orchestrator</p>
          </div>
          <div className="grid-3">
            {[
              { icon: '👥', name: 'Visitor Flow Agent', desc: 'Monitors crowd density and recommends visitor redistribution to protect heritage fabric.', priority: 'P0 — Production' },
              { icon: '📖', name: 'Heritage Storytelling Agent', desc: 'Generates grounded personalised itineraries based on verified heritage content.', priority: 'P0 — Production' },
              { icon: '📋', name: 'Conservation Reporting Agent', desc: 'Synthesises multi-agent findings into prioritised conservation recommendations.', priority: 'P0 — Production' },
              { icon: '🏛', name: 'Structural Health Agent', desc: 'Flags demo structural observations and conservation concerns for human review.', priority: 'P1 — MVP' },
              { icon: '🗺', name: 'Encroachment Detection Agent', desc: 'Identifies potential boundary violations requiring human verification.', priority: 'P1 — MVP' },
              { icon: '⬡', name: 'Heritage Orchestrator', desc: 'Central coordinator that parses user goals and dispatches the right agents.', priority: 'P0 — Production' },
            ].map(a => (
              <div key={a.name} className="card">
                <div style={{ fontSize: 28, marginBottom: 10 }} aria-hidden="true">{a.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 12 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>{a.priority}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'var(--surface)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Try the Complete Workflow</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>
            Plan a visit to Modhera, run the multi-agent orchestrator, and see real conservation analysis — all from your browser.
          </p>
          <Link to="/visitor/guide">
            <button className="btn btn-primary btn-lg">✦ Generate My Heritage Experience</button>
          </Link>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
            No sign-up required · Uses IBM Granite when configured · Runs in demo mode offline
          </div>
        </div>
      </section>

      {/* Disclosure */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
        <p><strong>SIMULATED DEMO DATA</strong> — All visitor statistics, structural observations, and conservation data are simulated. Do not use for real heritage management decisions.</p>
        <p style={{ marginTop: 6 }}>IBM Bob (development assistant) · IBM Granite (runtime AI) · Gujarat Hackathon 2026</p>
      </footer>
    </div>
  )
}
