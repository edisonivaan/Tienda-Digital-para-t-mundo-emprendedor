import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationPanel from './NotificationPanel';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isSeller, logout } = useAuth();
  const { itemCount } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/catalogo?search=' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
      setMobileOpen(false);
    }
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  }

  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  return (
    <>
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">Tienda Digital</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/catalogo"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              Catálogo
            </NavLink>
            {isAuthenticated && isSeller && (
              <NavLink
                to="/publicar"
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              >
                Publicar
              </NavLink>
            )}
          </div>

          {/* Search */}
          <form className="navbar-search desktop-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos"
            />
            <span className="navbar-search-icon">🔍</span>
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart */}
            <Link to="/carrito" className="nav-icon-btn" aria-label="Carrito de compras">
              🛒
              {itemCount > 0 && (
                <span className="nav-badge">{itemCount > 99 ? '99+' : itemCount}</span>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  className="nav-icon-btn"
                  onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                  aria-label="Notificaciones"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  )}
                </button>
                {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
              </div>
            )}

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="nav-profile-wrapper" ref={dropdownRef}>
                <button
                  className="nav-profile-btn"
                  onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                  aria-label="Menú de usuario"
                >
                  <div className="nav-avatar">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                      : getInitials(user.name)
                    }
                  </div>
                  <span className="nav-profile-chevron" style={{marginLeft: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)'}}>▼</span>
                </button>

                {dropdownOpen && (
                  <div className="nav-profile-dropdown">
                    <div className="nav-profile-header">
                      <div className="nav-avatar nav-avatar--lg">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
                          : getInitials(user.name)
                        }
                      </div>
                      <div>
                        <div className="nav-profile-name">{user.name}</div>
                        <div className="nav-profile-email">{user.email}</div>
                        <span className="nav-profile-role" style={{fontSize: '0.75rem', color: 'var(--color-primary-light)'}}>
                          {user.role === 'admin' ? 'Administrador' : user.role === 'vendedor' ? 'Vendedor' : 'Comprador'}
                        </span>
                      </div>
                    </div>

                    <div className="nav-profile-divider" />

                    <Link
                      to="/perfil"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>👤</span> Mi Perfil
                    </Link>

                    <Link
                      to="/pedidos"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🛍️</span> Mis Pedidos
                    </Link>

                    <Link
                      to="/mensajes"
                      className="nav-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>💬</span> Mensajes
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="nav-dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>⚙️</span> Panel Admin
                      </Link>
                    )}

                    <div className="nav-profile-divider" />

                    <button
                      className="nav-dropdown-item nav-dropdown-item--danger"
                      onClick={handleLogout}
                    >
                      <span>🚪</span> Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-buttons">
                <Link to="/login" className="nav-btn nav-btn--ghost">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="nav-btn nav-btn--primary">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
              <span className={`hamburger-line ${mobileOpen ? 'hamburger-line--open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Mobile Search */}
        <form className="navbar-search mobile-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="navbar-search-icon">🔍</span>
        </form>

        {/* Mobile Nav */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          onClick={() => setMobileOpen(false)}
        >
          <span>🏠</span> Inicio
        </NavLink>
        <NavLink
          to="/catalogo"
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          onClick={() => setMobileOpen(false)}
        >
          <span>📋</span> Catálogo
        </NavLink>
        {isAuthenticated && isSeller && (
          <NavLink
            to="/publicar"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <span>➕</span> Publicar
          </NavLink>
        )}

        <div className="nav-profile-divider" style={{margin: '1rem 0'}} />

        {isAuthenticated ? (
          <>
            <NavLink
              to="/perfil"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>👤</span> Mi Perfil
            </NavLink>
            <NavLink
              to="/pedidos"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>🛍️</span> Mis Pedidos
            </NavLink>
            <NavLink
              to="/mensajes"
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span>💬</span> Mensajes
            </NavLink>

            <div className="nav-profile-divider" style={{margin: '1rem 0'}} />

            <button
              className="nav-link"
              onClick={handleLogout}
              style={{ color: 'var(--color-danger)', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <Link
              to="/login"
              className="nav-btn nav-btn--ghost"
              style={{justifyContent: 'center'}}
              onClick={() => setMobileOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="nav-btn nav-btn--primary"
              style={{justifyContent: 'center'}}
              onClick={() => setMobileOpen(false)}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
