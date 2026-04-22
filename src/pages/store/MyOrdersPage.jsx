import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { Navigate, Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';
const STATUS_VARIANT = { Delivered:'success', Pending:'warning', Processing:'info', Shipped:'brand', Cancelled:'danger' };

export default function MyOrdersPage() {
  const { state } = useStore();
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Filter orders for the current user
  const myOrders = state.orders.filter(o => o.userId === currentUser.id);

  return (
    <div className="page-container" style={{ padding: '60px 24px', minHeight: '60vh' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: 8 }}>
          My Orders
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Track, manage, and view your recent purchases</p>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState 
          icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>} 
          title="No orders yet" 
          subtitle="Looks like you haven't made any purchases yet." 
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800, margin: '0 auto' }}>
          {myOrders.map(order => (
            <div key={order.id} className="glass-card" style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
                borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 16,
                flexWrap: 'wrap', gap: 12
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Order ID</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, color: 'var(--brand)' }}>{order.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Date Placed</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{order.date}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Items</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.qty}x</span> {item.name}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {fmt(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                background: 'var(--bg-glass)', padding: '16px 20px', borderRadius: 'var(--radius-sm)',
                flexWrap: 'wrap', gap: 16
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</div>
                  <Badge variant={STATUS_VARIANT[order.status] || 'muted'}>{order.status}</Badge>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--brand)' }}>
                    {fmt(order.total)}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
