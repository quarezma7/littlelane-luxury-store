import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';
const STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled'];
const STATUS_VARIANT = { Delivered:'success', Pending:'warning', Processing:'info', Shipped:'brand', Cancelled:'danger' };

function OrderDetailModal({ order, isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState(order?.status || '');
  const [notes, setNotes] = useState(order?.notes || '');

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.id}`} maxWidth={580}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {/* Customer info */}
        <div className="grid-responsive-2" style={{ gap: 12 }}>
          <InfoBox label="Customer" value={order.customer} />
          <InfoBox label="Email" value={order.email} />
          <InfoBox label="Date" value={order.date} />
          <InfoBox label="Total" value={fmt(order.total)} valueColor="var(--brand)" />
          <InfoBox label="Delivery Address" value={order.address} style={{ gridColumn:'1/-1' }} />
        </div>

        {/* Items */}
        <div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Items</div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border-subtle)', fontSize:'0.875rem' }}>
              <span style={{ color:'var(--text-secondary)' }}>{item.name} × {item.qty}</span>
              <span style={{ color:'var(--brand)', fontFamily:'var(--font-display)' }}>{fmt(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        {/* Status change */}
        <div>
          <label style={{ display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Update Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{
            width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-glass)',
            borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem',
            fontFamily:'var(--font-body)', marginBottom:12, cursor:'pointer',
          }}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={{ display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Internal Notes</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)}
            style={{ width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-glass)',
              borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem',
              fontFamily:'var(--font-body)', resize:'vertical', minHeight:70 }}
            placeholder="Internal notes..."
            onFocus={e=>e.target.style.borderColor='var(--brand)'}
            onBlur={e=>e.target.style.borderColor='var(--border-glass)'}
          />
        </div>
        <Button onClick={() => { onUpdate({...order, status, notes}); onClose(); }}>Save Changes</Button>
      </div>
    </Modal>
  );
}

function InfoBox({ label, value, valueColor, style={} }) {
  return (
    <div style={{ ...style }}>
      <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
      <div style={{ fontSize:'0.875rem', color: valueColor || 'var(--text-primary)', fontWeight:500 }}>{value}</div>
    </div>
  );
}

function exportCSV(orders) {
  const headers = ['Order ID','Customer','Email','Items','Total (TND)','Status','Date'];
  const rows = orders.map(o => [
    o.id, o.customer, o.email,
    o.items.map(i=>`${i.name}x${i.qty}`).join('; '),
    o.total, o.status, o.date,
  ]);
  const csv = [headers, ...rows].map(r => r.map(v=>`"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'littlelane_orders.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function OrdersPage() {
  const { state, dispatch } = useStore();
  const { addToast, addNotification } = useApp();
  const detailModal = useModal();
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = statusFilter === 'All'
    ? state.orders
    : state.orders.filter(o => o.status === statusFilter);

  const handleUpdate = (order) => {
    dispatch({ type:'UPDATE_ORDER', payload: order });
    addToast('Order updated', 'success');
    addNotification('Order Status Update', `Your order ${order.id} is now ${order.status}.`, order.userId, true);
  };

  const counts = ['All', ...STATUSES].reduce((acc, s) => {
    acc[s] = s === 'All' ? state.orders.length : state.orders.filter(o=>o.status===s).length;
    return acc;
  }, {});

  const thStyle = { padding:'10px 14px', textAlign:'left', color:'var(--text-muted)', fontWeight:500, fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border-glass)' };

  return (
    <div style={{ padding:28 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, gap:12, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Orders</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{state.orders.length} total orders</p>
        </div>
        <Button variant="secondary" onClick={() => { exportCSV(filtered); addToast('CSV exported!', 'success'); }}>📥 Export CSV</Button>
      </div>

      {/* Status filter tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={()=>setStatusFilter(s)} style={{
            padding:'7px 14px', borderRadius:'var(--radius-full)',
            background: statusFilter===s ? 'var(--brand-gradient)' : 'var(--bg-glass)',
            color: statusFilter===s ? '#0a0c18' : 'var(--text-secondary)',
            border: statusFilter===s ? 'none' : '1px solid var(--border-subtle)',
            fontWeight: statusFilter===s ? 700 : 400,
            fontSize:'0.8rem', cursor:'pointer', transition:'all var(--transition-fast)',
            fontFamily:'var(--font-body)',
          }}>
            {s} <span style={{ opacity:0.7, fontSize:'0.72rem' }}>({counts[s]})</span>
          </button>
        ))}
      </div>

      <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', overflow:'auto' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} title="No orders found" />
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr>
                {['Order ID','Customer','Items','Total','Status','Date'].map(h=>(
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id}
                  className={`table-row-hover ${i%2===0?'table-row-even':''}`}
                  onClick={() => detailModal.open(o)}
                  style={{ borderBottom:'1px solid var(--border-subtle)', cursor:'pointer' }}
                >
                  <td style={{padding:'12px 14px'}}><span style={{color:'var(--brand)',fontWeight:600,fontFamily:'var(--font-display)',fontSize:'0.85rem'}}>{o.id}</span></td>
                  <td style={{padding:'12px 14px',color:'var(--text-primary)',fontWeight:500}}>{o.customer}</td>
                  <td style={{padding:'12px 14px',color:'var(--text-muted)',fontSize:'0.8rem',maxWidth:200}}>{o.items.map(i=>`${i.name}×${i.qty}`).join(', ')}</td>
                  <td style={{padding:'12px 14px',color:'var(--brand)',fontFamily:'var(--font-display)',fontWeight:600}}>{fmt(o.total)}</td>
                  <td style={{padding:'12px 14px'}}><Badge variant={STATUS_VARIANT[o.status]||'muted'}>{o.status}</Badge></td>
                  <td style={{padding:'12px 14px',color:'var(--text-muted)',fontSize:'0.8rem'}}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <OrderDetailModal order={detailModal.data} isOpen={detailModal.isOpen} onClose={detailModal.close} onUpdate={handleUpdate} />
    </div>
  );
}
