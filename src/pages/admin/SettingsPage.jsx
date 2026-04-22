import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function SettingsPage() {
  const { settings, updateSettings, toggleTheme, theme, addToast } = useApp();
  const { dispatch: adminDispatch } = useAdmin();
  const { dispatch: storeDispatch } = useStore();
  const [form, setForm] = useState({ ...settings });
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetDouble, setResetDouble] = useState(false);

  const inp = { width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-subtle)', borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', marginBottom:14, transition:'all var(--transition-fast)' };
  const lab = { display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' };
  const focus = e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px var(--brand-glow)'; };
  const blur = e => { e.target.style.borderColor='var(--border-subtle)'; e.target.style.boxShadow=''; };

  const handleSave = () => {
    updateSettings(form);
  };

  const handleReset = () => {
    adminDispatch({ type:'RESET_ALL' });
    storeDispatch({ type:'CLEAR_CART' });
    addToast('All data reset to defaults', 'warning');
    setResetConfirm(false);
    setResetDouble(false);
  };

  const Toggle = ({ value, onChange, label }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid var(--border-subtle)' }}>
      <span style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{label}</span>
      <div onClick={onChange} style={{ width:44,height:24,borderRadius:12, background:value?'var(--brand)':'var(--bg-tertiary)', border:`1px solid ${value?'var(--brand)':'var(--border-subtle)'}`, cursor:'pointer', position:'relative', transition:'all var(--transition-base)' }}>
        <div style={{ width:18,height:18,borderRadius:'50%', background:value?'#0a0c18':'var(--text-muted)', position:'absolute',top:2, left:value?22:2, transition:'left 0.2s ease' }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding:28, maxWidth:640 }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Settings</h1>
      <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', marginBottom:28 }}>Manage your store configuration</p>

      {/* Store Info */}
      <Section title="Store Information">
        <label style={lab}>Store Name</label>
        <input style={inp} value={form.storeName} onChange={e=>setForm(f=>({...f,storeName:e.target.value}))} onFocus={focus} onBlur={blur} />
        <div className="grid-responsive-2" style={{ gap: '0 16px' }}>
          <div>
            <label style={lab}>Currency</label>
            <input style={inp} value={form.currency} onChange={e=>setForm(f=>({...f,currency:e.target.value}))} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={lab}>Timezone</label>
            <input style={inp} value={form.timezone} onChange={e=>setForm(f=>({...f,timezone:e.target.value}))} onFocus={focus} onBlur={blur} />
          </div>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </Section>

      {/* Theme */}
      <Section title="Appearance">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0' }}>
          <div>
            <div style={{ color:'var(--text-secondary)', fontSize:'0.875rem', marginBottom:2 }}>Theme</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>Currently: {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {['dark','light'].map(t => (
              <button key={t} onClick={() => { if (theme !== t) toggleTheme(); }} style={{
                padding:'8px 16px', borderRadius:8, fontSize:'0.85rem', cursor:'pointer',
                background: theme===t ? 'var(--brand-gradient)' : 'var(--bg-glass)',
                border: theme===t ? 'none' : '1px solid var(--border-subtle)',
                color: theme===t ? '#0a0c18' : 'var(--text-secondary)', fontWeight: theme===t?700:400,
                fontFamily:'var(--font-body)', transition:'all var(--transition-fast)',
              }}>{t === 'dark' ? '🌙 Dark' : '☀️ Light'}</button>
            ))}
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences">
        <Toggle value={form.notifications?.newOrder} onChange={()=>setForm(f=>({...f,notifications:{...f.notifications,newOrder:!f.notifications?.newOrder}}))} label="New Order Alerts" />
        <Toggle value={form.notifications?.lowStock} onChange={()=>setForm(f=>({...f,notifications:{...f.notifications,lowStock:!f.notifications?.lowStock}}))} label="Low Stock Alerts" />
        <Toggle value={form.notifications?.newUser} onChange={()=>setForm(f=>({...f,notifications:{...f.notifications,newUser:!f.notifications?.newUser}}))} label="New User Registrations" />
        <div style={{ marginTop:14 }}>
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="⚠ Danger Zone">
        <div style={{ background:'var(--danger-bg)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:10, padding:'16px' }}>
          <div style={{ color:'var(--danger)', fontWeight:600, marginBottom:6, fontSize:'0.875rem' }}>Reset All Data</div>
          <p style={{ color:'var(--text-muted)', fontSize:'0.8rem', marginBottom:14, lineHeight:1.6 }}>
            This will reset all users, promo codes, and settings to their default values. Orders and products in the store will also be cleared. This action cannot be undone.
          </p>
          <Button variant="danger" onClick={() => setResetConfirm(true)}>Reset All Data</Button>
        </div>
      </Section>

      {/* Reset Confirm */}
      <Modal isOpen={resetConfirm} onClose={()=>{setResetConfirm(false);setResetDouble(false);}} title="⚠ Reset All Data" maxWidth={420}>
        {!resetDouble ? (
          <>
            <p style={{ color:'var(--text-secondary)', marginBottom:20, lineHeight:1.7 }}>
              Are you absolutely sure? This will permanently reset all data to seed defaults. This cannot be undone.
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <Button variant="danger" onClick={()=>setResetDouble(true)} fullWidth>Yes, I'm Sure</Button>
              <Button variant="ghost" onClick={()=>setResetConfirm(false)} fullWidth>Cancel</Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background:'var(--danger-bg)', border:'1px solid var(--danger)', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
              <p style={{ color:'var(--danger)', fontWeight:600 }}>⚠ FINAL WARNING</p>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginTop:6 }}>Click "Reset Everything" to permanently destroy all data.</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Button variant="danger" onClick={handleReset} fullWidth>💥 Reset Everything</Button>
              <Button variant="ghost" onClick={()=>{setResetConfirm(false);setResetDouble(false);}} fullWidth>Cancel</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:28 }}>
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:16, paddingBottom:10, borderBottom:'1px solid var(--border-glass)' }}>{title}</h2>
      {children}
    </div>
  );
}
