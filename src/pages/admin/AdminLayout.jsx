import { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AdminSidebar from '../../features/admin/AdminSidebar';

export default function AdminLayout() {
  const { currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              LittleLane Admin Panel
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {currentUser.name}
            </span>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--brand-gradient)', color: '#0a0c18',
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

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', animation: 'fadeIn 0.3s ease' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
