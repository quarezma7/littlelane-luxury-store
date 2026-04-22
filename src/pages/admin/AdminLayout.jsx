import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../features/admin/AdminSidebar';

export default function AdminLayout() {
  const { currentUser, notifications, markNotificationsRead } = useApp();
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Admin topbar */}
        <header style={{
          height: 60, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button 
              className="mobile-only" 
              onClick={() => setCollapsed(false)}
              style={{
                background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 6,
                color: 'var(--text-primary)', width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >☰</button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              LittleLane Admin Panel
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {currentUser.name}
            </span>
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); markNotificationsRead(); }}
                style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)', width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  position: 'relative', transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <span style={{ fontSize: '1.1rem' }}>🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4, background: 'var(--danger)', color: 'white',
                    borderRadius: 'var(--radius-full)', fontSize: '0.65rem', fontWeight: 700,
                    width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0, width: 320, maxHeight: 400, overflowY: 'auto',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-glass)', fontWeight: 600, fontSize: '0.875rem' }}>
                    System Emails & Alerts
                  </div>
                  <div style={{ flex: 1, padding: 8 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent alerts</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)',
                          marginBottom: 8, fontSize: '0.85rem', borderLeft: `3px solid ${n.isEmail ? 'var(--brand)' : 'var(--warning)'}`
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

            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--brand-gradient)', color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem',
            }}>
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '7px 14px', background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)', borderRadius: 8,
                color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >← Store</button>
          </div>
        </header>

        {/* Overlay for mobile when sidebar is open */}
        {!collapsed && (
          <div 
            className="mobile-only"
            onClick={() => setCollapsed(true)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} 
          />
        )}

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', animation: 'fadeIn 0.3s ease' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
