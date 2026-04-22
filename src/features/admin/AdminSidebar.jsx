import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin/overview',   icon: '📊', label: 'Overview' },
  { to: '/admin/products',   icon: '📦', label: 'Products' },
  { to: '/admin/orders',     icon: '📋', label: 'Orders' },
  { to: '/admin/users',      icon: '👥', label: 'Users' },
  { to: '/admin/analytics',  icon: '📈', label: 'Analytics' },
  { to: '/admin/promotions', icon: '🏷️', label: 'Promotions' },
  { to: '/admin/settings',   icon: '⚙️', label: 'Settings' },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`} style={{
      width: collapsed ? 64 : 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex', flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
      flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      overflowX: 'hidden', zIndex: 100,
    }}>
      {/* Logo area */}
      <div style={{
        padding: collapsed ? '18px 0' : '20px 20px',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
        gap: 12, flexShrink: 0,
      }}>
        {!collapsed && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700,
            background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '0.1em',
          }}>ADMIN</span>
        )}
        <button onClick={() => setCollapsed(v => !v)} style={{
          background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
          borderRadius: 8, width: 32, height: 32,
          color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--transition-fast)', flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >{collapsed ? '→' : '←'}</button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <div key={item.to} style={{ position: 'relative' }} title={collapsed ? item.label : undefined}>
              <NavLink
                to={item.to}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: collapsed ? 0 : 12,
                  padding: collapsed ? '12px 0' : '11px 20px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? 'rgba(232,165,176,0.1)' : 'transparent',
                  borderLeft: `3px solid ${isActive ? 'var(--brand)' : 'transparent'}`,
                  color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                  fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
              </NavLink>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-glass)', flexShrink: 0 }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            LittleLane Admin Panel v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
