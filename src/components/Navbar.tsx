interface NavbarProps {
  activePage: 'home' | 'result' | 'admin'
  onNavigate: (page: 'home' | 'admin') => void
}

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  const isHomeActive = activePage === 'home' || activePage === 'result'
  const isAdminActive = activePage === 'admin'

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        <div className="navbar-logo">FB</div>
        <div>
          <div className="navbar-name">FitBuddy</div>
          <div className="navbar-tagline">AI Fitness Assistant</div>
        </div>
      </div>
      <div className="navbar-spacer" />
      <div className="navbar-links">
        <button
          className={`nav-link ${isHomeActive ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Generate Plan
        </button>
        <button
          className={`nav-link ${isAdminActive ? 'active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          Admin View
        </button>
      </div>
    </nav>
  )
}
