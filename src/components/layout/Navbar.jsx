import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useStore } from '../../context/StoreContext';
import { useDebounce } from '../../hooks/useDebounce';

export default function Navbar() {
  const { currentUser, setAuthModalOpen, logout, notifications, markNotificationsRead } = useApp();
  const { state, dispatch, cartCount, wishlistCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    window.addEventListener('scroll', onScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      navigate('/?search=' + encodeURIComponent(debouncedSearch));
    }
  }, [debouncedSearch, navigate]);

  const initials = currentUser
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 'var(--z-navbar)',
      background: scrolled ? 'var(--bg-overlay)' : 'transparent',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border-glass)' : 'transparent'}`,
      transition: 'all 0.3s ease',
    }}>
      <div className="page-container" style={{
        display: 'flex', alignItems: 'center', gap: '12px 24px', minHeight: 68, padding: '12px 24px', flexWrap: 'wrap', justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
          background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '0.12em', whiteSpace: 'nowrap', flexShrink: 0,
        }}>LittleLane</Link>

        {/* Search */}
        <div className="nav-search" style={{ flex: '1 1 200px', maxWidth: 440, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for kids, moms, toys..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)', padding: '8px 16px 8px 38px',
              color: 'var(--text-primary)', fontSize: '0.875rem',
              transition: 'all var(--transition-base)',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notifications */}
          {currentUser && (
            <div ref={notifRef} style={{ position: 'relative' }}>
              <NavBtn 
                onClick={() => { setShowNotifications(!showNotifications); markNotificationsRead(currentUser.id); }} 
                title="Notifications"
                badge={notifications.filter(n => !n.read && (n.targetUserId === currentUser.id || n.targetUserId === null)).length}
              >🔔</NavBtn>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '120%', right: -40, width: 320, maxHeight: 400, overflowY: 'auto',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-glass)', fontWeight: 600, fontSize: '0.875rem' }}>
                    Your Notifications
                  </div>
                  <div style={{ flex: 1, padding: 8 }}>
                    {notifications.filter(n => n.targetUserId === currentUser.id || n.targetUserId === null).length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent alerts</div>
                    ) : (
                      notifications.filter(n => n.targetUserId === currentUser.id || n.targetUserId === null).map(n => (
                        <div key={n.id} style={{
                          padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                          marginBottom: 8, fontSize: '0.85rem', borderLeft: `3px solid ${n.isEmail ? 'var(--brand)' : 'var(--info)'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.date}</span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <NavBtn onClick={() => navigate('/wishlist')} title="Wishlist" badge={wishlistCount}>♡</NavBtn>

          {/* Cart */}
          <NavBtn onClick={() => dispatch({ type: 'TOGGLE_CART_DRAWER' })} title="Cart" badge={cartCount}>🛒</NavBtn>

          {/* Admin panel */}
          {currentUser?.role === 'admin' && (
            <NavBtn onClick={() => navigate('/admin/overview')} title="Admin Panel">⚙️</NavBtn>
          )}

          {/* Auth */}
          <div style={{ position: 'relative' }}>
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{
                  width: 38, height: 38, borderRadius: 'var(--radius-full)',
                  background: 'var(--brand-gradient)', color: '#0a0c18',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'transform var(--transition-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >{initials}</button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                style={{
                  padding: '8px 18px', background: 'var(--bg-glass)',
                  border: '1px solid var(--brand-border)', borderRadius: 'var(--radius-full)',
                  color: 'var(--brand)', fontSize: '0.85rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; }}
              >Sign In</button>
            )}

            {/* User dropdown */}
            {showUserMenu && currentUser && (
              <div style={{
                position: 'absolute', top: '110%', right: 0,
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)', padding: '8px 0',
                minWidth: 180, boxShadow: 'var(--shadow-lg)',
                animation: 'fadeSlideDown 0.2s ease',
                zIndex: 10,
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                </div>
                {currentUser.role === 'admin' && (
                  <DropdownItem onClick={() => { navigate('/admin/overview'); setShowUserMenu(false); }}>⚙️ Admin Panel</DropdownItem>
                )}
                <DropdownItem onClick={() => { navigate('/wishlist'); setShowUserMenu(false); }}>♡ Wishlist</DropdownItem>
                <DropdownItem onClick={() => { navigate('/my-orders'); setShowUserMenu(false); }}>📦 My Orders</DropdownItem>
                <DropdownItem onClick={() => { logout(); setShowUserMenu(false); }} danger>→ Sign Out</DropdownItem>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showUserMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} onClick={() => setShowUserMenu(false)} />
      )}
    </nav>
  );
}

function NavBtn({ children, onClick, badge, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        position: 'relative', width: 40, height: 40,
        background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)',
        fontSize: '1.1rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.color = 'var(--brand)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: 'var(--brand)', color: '#0a0c18',
          borderRadius: 'var(--radius-full)', fontSize: '0.65rem',
          fontWeight: 700, width: 18, height: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
        }}>{badge > 9 ? '9+' : badge}</span>
      )}
    </button>
  );
}

function DropdownItem({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '8px 16px', background: 'none', border: 'none',
        color: danger ? 'var(--danger)' : 'var(--text-secondary)',
        fontSize: '0.875rem', cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >{children}</button>
  );
}
