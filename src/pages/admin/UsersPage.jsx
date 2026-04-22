import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const ROLE_VARIANT = { admin:'admin', editor:'info', customer:'customer' };
const ROLES = ['customer', 'editor', 'admin'];

function UserFormModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer' });

  const inp = { width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-subtle)', borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', marginBottom:14, transition:'all var(--transition-fast)' };
  const lab = { display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' };
  const focus = e => { e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px var(--brand-glow)'; };
  const blur = e => { e.target.style.borderColor='var(--border-subtle)'; e.target.style.boxShadow=''; };

  const handleSave = () => {
    if (!form.name || !form.email || !form.password) return;
    onSave({ ...form, id:'u'+Date.now(), orders:0, spent:0, joined:new Date().toISOString().split('T')[0], status:'active' });
    setForm({ name:'', email:'', password:'', role:'customer' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" maxWidth={400}>
      <label style={lab}>Full Name *</label>
      <input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} onFocus={focus} onBlur={blur} placeholder="Sophia Khelifi" />
      <label style={lab}>Email *</label>
      <input type="email" style={inp} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onFocus={focus} onBlur={blur} placeholder="user@example.com" />
      <label style={lab}>Password *</label>
      <input type="password" style={inp} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onFocus={focus} onBlur={blur} placeholder="••••••••" />
      <label style={lab}>Role</label>
      <select style={{...inp}} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
        {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
      </select>
      <div style={{ display:'flex', gap:10, marginTop:4 }}>
        <Button onClick={handleSave} fullWidth>+ Create User</Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function UsersPage() {
  const { state, dispatch } = useAdmin();
  const { addToast, currentUser, addNotification } = useApp();
  const addModal = useModal();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = state.users.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  );

  const handleAdd = (user) => {
    dispatch({ type:'ADD_USER', payload: user });
    addToast('User created', 'success');
    addNotification('Welcome to LittleLane!', `Your account has been successfully created with the role of ${user.role}.`, user.id, true);
  };

  const changeRole = (user, role) => {
    dispatch({ type:'UPDATE_USER', payload: {...user, role} });
    addToast(`${user.name}'s role updated to ${role}`, 'success');
    addNotification('Role Updated', `Your account role has been updated to ${role}.`, user.id, true);
  };

  const toggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    dispatch({ type:'UPDATE_USER', payload: {...user, status: newStatus} });
    addToast(`${user.name} ${newStatus === 'active' ? 'activated' : 'suspended'}`, newStatus === 'active' ? 'success' : 'warning');
  };

  const handleDelete = (id) => {
    dispatch({ type:'DELETE_USER', payload: id });
    addToast('User deleted', 'info');
    setDeleteConfirm(null);
  };

  const thStyle = { padding:'10px 14px', textAlign:'left', color:'var(--text-muted)', fontWeight:500, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border-glass)' };
  const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

  return (
    <div style={{ padding:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:12, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Users</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{state.users.length} registered users</p>
        </div>
        <Button onClick={addModal.open}>+ Add User</Button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search users..."
          style={{ flex:1, minWidth:200, background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-body)' }}
          onFocus={e=>e.target.style.borderColor='var(--brand)'} onBlur={e=>e.target.style.borderColor='var(--border-glass)'}
        />
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:10, padding:'10px 14px', color:'var(--text-secondary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', cursor:'pointer' }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
        </select>
      </div>

      <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', overflow:'auto' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} title="No users found" />
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr>
                {['User','Email','Role','Orders','Spent','Joined','Status','Actions'].map(h=>(
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`table-row-hover ${i%2===0?'table-row-even':''}`}
                  style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34,height:34,borderRadius:'50%', background:'var(--brand-gradient)', color:'#0a0c18', display:'flex',alignItems:'center',justifyContent:'center', fontWeight:700,fontSize:'0.78rem',flexShrink:0 }}>
                        {u.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      <span style={{ fontWeight:500, color:'var(--text-primary)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{padding:'12px 14px',color:'var(--text-muted)',fontSize:'0.8rem'}}>{u.email}</td>
                  <td style={{padding:'12px 14px'}}>
                    <select value={u.role} onChange={e=>changeRole(u,e.target.value)} style={{ background:'var(--bg-glass)', border:'1px solid var(--border-subtle)', borderRadius:6, padding:'4px 8px', color:'var(--text-secondary)', fontSize:'0.8rem', fontFamily:'var(--font-body)', cursor:'pointer' }} onClick={e=>e.stopPropagation()}>
                      {ROLES.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{padding:'12px 14px',color:'var(--text-secondary)',textAlign:'center'}}>{u.orders}</td>
                  <td style={{padding:'12px 14px',color:'var(--brand)',fontFamily:'var(--font-display)',fontWeight:600,fontSize:'0.85rem'}}>{fmt(u.spent)}</td>
                  <td style={{padding:'12px 14px',color:'var(--text-muted)',fontSize:'0.8rem'}}>{u.joined}</td>
                  <td style={{padding:'12px 14px'}}>
                    <Badge variant={u.status==='active'?'success':'danger'}>{u.status}</Badge>
                  </td>
                  <td style={{padding:'12px 14px'}}>
                    <div style={{ display:'flex', gap:6 }}>
                      <Button size="sm" variant={u.status==='active'?'warning':'success'} onClick={()=>toggleStatus(u)} style={{ fontSize:'0.72rem' }}>
                        {u.status==='active'?'Suspend':'Activate'}
                      </Button>
                      {u.id !== currentUser?.id && (
                        <Button size="sm" variant="danger" onClick={()=>setDeleteConfirm(u.id)}>✕</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserFormModal isOpen={addModal.isOpen} onClose={addModal.close} onSave={handleAdd} />
      <Modal isOpen={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="Delete User" maxWidth={360}>
        <p style={{color:'var(--text-secondary)',marginBottom:20}}>Delete this user account? This cannot be undone.</p>
        <div style={{display:'flex',gap:10}}>
          <Button variant="danger" onClick={()=>handleDelete(deleteConfirm)} fullWidth>Delete</Button>
          <Button variant="ghost" onClick={()=>setDeleteConfirm(null)} fullWidth>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
