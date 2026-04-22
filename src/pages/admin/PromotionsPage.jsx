import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const EMPTY_PROMO = { code:'', type:'percent', value:'', maxUses:'', expiry:'', active:true };

function PromoFormModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_PROMO);

  const inp = { width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-subtle)', borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', marginBottom:14, transition:'all var(--transition-fast)' };
  const lab = { display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' };
  const focus = e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px var(--brand-glow)'; };
  const blur = e => { e.target.style.borderColor='var(--border-subtle)'; e.target.style.boxShadow=''; };

  const handleSave = () => {
    if (!form.code || !form.value || !form.maxUses || !form.expiry) return;
    onSave({ ...form, id:'promo'+Date.now(), value:Number(form.value), maxUses:Number(form.maxUses), uses:0 });
    setForm(EMPTY_PROMO);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Promo Code" maxWidth={400}>
      <label style={lab}>Promo Code *</label>
      <input style={{...inp}} value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} onFocus={focus} onBlur={blur} placeholder="SUMMER30" />
      <div className="grid-responsive-2" style={{ gap: '0 16px' }}>
        <div>
          <label style={lab}>Discount %</label>
          <input type="number" min="1" max="90" style={inp} value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} onFocus={focus} onBlur={blur} placeholder="20" />
        </div>
        <div>
          <label style={lab}>Max Uses</label>
          <input type="number" min="1" style={inp} value={form.maxUses} onChange={e=>setForm(f=>({...f,maxUses:e.target.value}))} onFocus={focus} onBlur={blur} placeholder="100" />
        </div>
      </div>
      <label style={lab}>Expiry Date *</label>
      <input type="date" style={inp} value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))} onFocus={focus} onBlur={blur} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <span style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>Active</span>
        <div onClick={()=>setForm(f=>({...f,active:!f.active}))} style={{ width:44,height:24,borderRadius:12, background:form.active?'var(--brand)':'var(--bg-tertiary)', border:`1px solid ${form.active?'var(--brand)':'var(--border-subtle)'}`, cursor:'pointer', position:'relative', transition:'all var(--transition-base)' }}>
          <div style={{ width:18,height:18,borderRadius:'50%', background:form.active?'#0a0c18':'var(--text-muted)', position:'absolute',top:2, left:form.active?22:2, transition:'left 0.2s ease' }} />
        </div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <Button onClick={handleSave} fullWidth>+ Create Promo</Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function PromotionsPage() {
  const { state, dispatch } = useAdmin();
  const { addToast, addNotification } = useApp();
  const addModal = useModal();

  const togglePromo = (promo) => {
    dispatch({ type:'UPDATE_PROMO', payload: {...promo, active: !promo.active} });
    addToast(`Code ${promo.code} ${!promo.active ? 'activated' : 'deactivated'}`, 'success');
  };

  const deletePromo = (id) => {
    dispatch({ type:'DELETE_PROMO', payload: id });
    addToast('Promo code deleted', 'info');
  };

  const handleSave = (promo) => {
    dispatch({ type:'ADD_PROMO', payload: promo });
    addToast(`Promo code "${promo.code}" created`, 'success');
    addNotification('New Promotion Alert', `A new promo code "${promo.code}" for ${promo.value}% off is now active!`, null, true);
  };

  const thStyle = { padding:'10px 14px', textAlign:'left', color:'var(--text-muted)', fontWeight:500, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border-glass)' };

  return (
    <div style={{ padding:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Promotions</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{state.promos.length} promo codes</p>
        </div>
        <Button onClick={addModal.open}>+ Create Promo</Button>
      </div>

      <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', overflow:'auto' }}>
        {state.promos.length === 0 ? (
          <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>} title="No promo codes yet" subtitle="Create your first promotion" />
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr>
                {['Code','Discount','Usages','Expiry','Status','Actions'].map(h=>(
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.promos.map((p, i) => {
                const usePct = Math.round((p.uses / p.maxUses) * 100);
                const isExpired = new Date(p.expiry) < new Date();
                return (
                  <tr key={p.id} className={`table-row-hover ${i%2===0?'table-row-even':''}`}
                    style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                    <td style={{padding:'12px 14px'}}>
                      <code style={{ background:'var(--bg-tertiary)', border:'1px solid var(--border-glass)', borderRadius:6, padding:'3px 10px', color:'var(--brand)', fontSize:'0.875rem', fontWeight:700, letterSpacing:'0.06em' }}>{p.code}</code>
                    </td>
                    <td style={{padding:'12px 14px',color:'var(--text-primary)',fontWeight:600}}>{p.value}%</td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:4 }}>{p.uses} / {p.maxUses}</div>
                      <div style={{ height:4, background:'var(--bg-tertiary)', borderRadius:2, width:80 }}>
                        <div style={{ height:'100%', borderRadius:2, width:`${usePct}%`, background: usePct>80?'var(--danger)':usePct>50?'var(--warning)':'var(--success)' }} />
                      </div>
                    </td>
                    <td style={{padding:'12px 14px',color: isExpired?'var(--danger)':'var(--text-muted)', fontSize:'0.85rem'}}>{p.expiry} {isExpired&&'(expired)'}</td>
                    <td style={{padding:'12px 14px'}}>
                      <Badge variant={p.active && !isExpired ? 'success' : 'muted'}>{p.active && !isExpired ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{ display:'flex', gap:6 }}>
                        <Button size="sm" variant={p.active?'ghost':'success'} onClick={()=>togglePromo(p)}>
                          {p.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="danger" onClick={()=>deletePromo(p.id)}>✕</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <PromoFormModal isOpen={addModal.isOpen} onClose={addModal.close} onSave={handleSave} />
    </div>
  );
}
