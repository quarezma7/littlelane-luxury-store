import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../features/admin/AdminSidebar';

export default function AdminLayout() {
  const { theme, toggleTheme, currentUser, notifications, markNotificationsRead } = useApp();
  const [collapsed, setCollapsed] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 15% 50%, rgba(56, 189, 248, 0.08), transparent 30%), radial-gradient(circle at 85% 30%, rgba(20, 184, 166, 0.08), transparent 30%), var(--bg-primary)',
      position: 'relative'
    }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        padding: '24px',
        maxWidth: '2400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Admin topbar (Floating Glass) */}
        <header style={{
          height: 68, 
          background: 'rgba(255, 255, 255, 0.05)', 
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', 
          position: 'sticky', top: 24, zIndex: 50, flexShrink: 0,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              className="mobile-only" 
              onClick={() => setCollapsed(false)}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: 8,
                color: 'var(--text-primary)', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '0.02em', fontFamily: 'var(--font-display)' }}>
                LittleLane Command Center
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--brand)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Enterprise Dashboard
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)', width: 38, height: 38, color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>

            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); markNotificationsRead(); }}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)', width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  position: 'relative', transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2, background: 'var(--brand)', color: '#000',
                    borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 800,
                    width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px var(--brand)'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '130%', right: 0, width: 340, maxHeight: 400, overflowY: 'auto',
                  background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 100,
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-glass)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--brand)' }}>
                    System Alerts
                  </div>
                  <div style={{ flex: 1, padding: 12 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Systems nominal. No alerts.</div>
                    ) : (
                      notifications.map(n => (
                         <div key={n.id} style={{
                          padding: '14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                          marginBottom: 10, fontSize: '0.85rem', borderLeft: `4px solid ${n.isEmail ? 'var(--brand)' : 'var(--warning)'}`,
                          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.date}</span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 16, borderLeft: '1px solid var(--border-glass)' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'var(--brand-gradient)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 0 15px rgba(20, 184, 166, 0.3)'
              }}>
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Administrator</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                marginLeft: 10,
                padding: '8px 16px', background: 'transparent',
                border: '1px solid var(--brand)', borderRadius: 'var(--radius-md)',
                color: 'var(--brand)', fontSize: '0.8rem', cursor: 'pointer',
                fontWeight: 600, transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-gradient)'; e.currentTarget.style.color = '#000'; e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.boxShadow = '0 0 15px rgba(20, 184, 166, 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.border = '1px solid var(--brand)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Exit to Store
            </button>
          </div>
        </header>

        {/* Overlay for mobile when sidebar is open */}
        {!collapsed && (
          <div 
            className="mobile-only"
            onClick={() => setCollapsed(true)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 90 }} 
          />
        )}

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 40, animation: 'fadeIn 0.4s ease' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
