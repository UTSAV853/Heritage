import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Nav() {
  const location = useLocation()
  const isAuthority = location.pathname.startsWith('/dashboard')
  const [mode, setMode] = useState<'visitor' | 'authority'>(isAuthority ? 'authority' : 'visitor')

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" aria-label="Smart Heritage Conservation Platform home">
          <div className="nav-brand-icon" aria-hidden="true">⬡</div>
          <span>Smart Heritage</span>
        </NavLink>

        <div className="nav-links">
          {!isAuthority ? (
            <>
              <NavLink to="/visitor" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Explore</NavLink>
              <NavLink to="/visitor/guide" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Heritage Guide</NavLink>
              <NavLink to="/visitor/itinerary" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>My Itinerary</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" end className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Overview</NavLink>
              <NavLink to="/dashboard/visitor-flow" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Visitor Flow</NavLink>
              <NavLink to="/dashboard/alerts" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Alerts</NavLink>
              <NavLink to="/dashboard/reports" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Reports</NavLink>
              <NavLink to="/dashboard/agents" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Agents</NavLink>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {isAuthority ? (
            <NavLink to="/visitor"><button className="nav-btn nav-btn-outline">Visitor View</button></NavLink>
          ) : (
            <NavLink to="/dashboard"><button className="nav-btn nav-btn-primary">Authority Dashboard</button></NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
