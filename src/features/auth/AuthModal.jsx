import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, addToast } = useApp();
  const { state: adminState, dispatch: adminDispatch } = useAdmin();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));

    const user = adminState.users.find(u =>
      u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    );
    
    // Emergency fallback if MongoDB is empty (allows admin to login and seed DB)
    if (!user && form.email === 'admin@store.com' && form.password === 'admin123') {
      login({ id: 'u1', name: 'Admin User', email: 'admin@store.com', role: 'admin' });
      addToast('Emergency Admin Login. Please go to Settings and Reset Database.', 'warning');
      setForm({ email: '', password: '', name: '' });
      setLoading(false);
      return;
    }

    if (!user) { setError('Invalid email or password.'); setLoading(false); return; }
    if (user.status === 'suspended') { setError('This account has been suspended.'); setLoading(false); return; }

    login(user);
    addToast(`Welcome back, ${user.name.split(' ')[0]}! ✨`, 'success');
    setForm({ email: '', password: '', name: '' });
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill all fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (adminState.users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      setError('An account with this email already exists.'); return;
    }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));

    const newUser = {
      id: 'u' + Date.now(),
      name: form.name, email: form.email, password: form.password,
      role: 'customer', orders: 0, spent: 0,
      joined: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    adminDispatch({ type: 'ADD_USER', payload: newUser });
    login(newUser);
    addToast(`Account created! Welcome to LittleLane ✨`, 'success');
    setForm({ email: '', password: '', name: '' });
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
    borderRadius: 10, padding: '11px 14px', color: 'var(--text-primary)',
    fontSize: '0.9rem', transition: 'all var(--transition-fast)', marginBottom: 14,
    display: 'block',
  };
  const labelStyle = { display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' };

  return (
    <Modal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} title="Welcome to LittleLane" maxWidth={420}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-glass)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
        {['login', 'register'].map(t => (
          <button key={t} onClick={() => { setTab(t); setError(''); }}
            style={{
              flex: 1, padding: '9px', borderRadius: 8, border: 'none',
              background: tab === t ? 'var(--brand-gradient)' : 'transparent',
              color: tab === t ? '#0a0c18' : 'var(--text-muted)',
              fontWeight: tab === t ? 700 : 400, fontSize: '0.875rem',
              cursor: 'pointer', transition: 'all var(--transition-fast)',
              fontFamily: 'var(--font-body)',
            }}>
            {t === 'login' ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      {/* Hint */}
      <div style={{
        background: 'rgba(232,165,176,0.08)', border: '1px solid var(--brand-border)',
        borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: '0.78rem', color: 'var(--text-muted)',
      }}>
        <strong style={{ color: 'var(--brand)' }}>Demo:</strong><br />
        Admin: admin@store.com / admin123<br />
        Customer: user@store.com / user123
      </div>

      {/* Form */}
      {tab === 'register' && (
        <div>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} type="text" placeholder="Sophia Khelifi" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = ''; }}
          />
        </div>
      )}
      <div>
        <label style={labelStyle}>Email</label>
        <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = ''; }}
        />
      </div>
      <div>
        <label style={labelStyle}>Password</label>
        <input style={inputStyle} type="password" placeholder="••••••••" value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
          onFocus={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = ''; }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: 8,
          padding: '10px 14px', marginBottom: 16, color: 'var(--danger)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <Button
        fullWidth
        onClick={tab === 'login' ? handleLogin : handleRegister}
        disabled={loading}
        style={{ marginTop: 4 }}
      >
        {loading ? '⏳ Please wait...' : (tab === 'login' ? '→ Sign In' : '✨ Create Account')}
      </Button>
    </Modal>
  );
}
