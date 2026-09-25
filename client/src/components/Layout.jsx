import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, showHero = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`app-shell ${theme === 'light' ? 'light-theme' : ''}`}>
      <header className="topbar">
        <div className="container nav-wrap">
          <Link to="/" className="brand" aria-label="SafeURL Checker home">
            <span className="brand-mark">S</span>
            <span>SafeURL Checker</span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            {user ? (
              <>
                <span className="nav-user">{user.name}</span>
                <button className="secondary-btn small" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
            <button
              type="button"
              className="secondary-btn small"
              onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </nav>
        </div>
      </header>

      {showHero && (
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Cybersecurity Utility</span>
              <h1>Check Before You Click.</h1>
              <p>
                Analyze suspicious URLs and understand potential security risks before opening them.
              </p>
              <div className="hero-actions">
                <Link className="primary-btn" to="/login">Get Started</Link>
                <a className="secondary-btn" href="#features">Explore Features</a>
              </div>
            </div>
            <div className="hero-card">
              <div className="security-pill ok">Likely Safe</div>
              <div className="score-display">92/100</div>
              <ul>
                <li>HTTPS enabled</li>
                <li>Legitimate structure</li>
                <li>No suspicious keywords</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <main>{children}</main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© 2026 SafeURL Checker</p>
          <p className="small-note">
            SafeURL Checker provides automated security analysis and should not be considered a guarantee that a website is completely safe.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
