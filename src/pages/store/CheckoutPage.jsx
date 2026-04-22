import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

export default function CheckoutPage() {
  const { state, dispatch, discountedTotal } = useStore();
  const { currentUser, addToast } = useApp();
  const { state: adminState } = useAdmin();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '', address: '', city: '', notes: '',
  });
  const [placed, setPlaced] = useState(false);

  if (state.cart.length === 0 && !placed) {
    return (
      <div className="page-container" style={{ padding: '80px 24px' }}>
        <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>} title="Your cart is empty"
          subtitle="Add some items before checking out"
          action={<Link to="/"><Button>Browse Collection</Button></Link>}
        />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="page-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', animation: 'scaleIn 0.5s ease' }}>
          <div style={{ fontSize: '5rem', marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>✨</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 12 }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
            Thank you for shopping at LittleLane. Your order has been received and will be processed shortly.
          </p>
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--brand-border)', borderRadius: 12, padding: '20px', marginBottom: 32, display: 'inline-block' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brand)' }}>
              Total paid: {fmt(discountedTotal)}
            </div>
          </div>
          <div>
            <Button onClick={() => navigate('/')} fullWidth>Continue Shopping →</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleOrder = () => {
    if (!form.name || !form.email || !form.address || !form.city) {
      addToast('Please fill in all required fields', 'error'); return;
    }
    const orderId = 'ORD-' + String(Date.now()).slice(-6);
    dispatch({
      type: 'ADD_ORDER',
      payload: {
        id: orderId, userId: currentUser?.id || 'guest',
        customer: form.name, email: form.email,
        address: `${form.address}, ${form.city}`,
        items: state.cart.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
        total: discountedTotal, status: 'Pending',
        date: new Date().toISOString().split('T')[0], notes: form.notes,
      },
    });
    dispatch({ type: 'CLEAR_CART' });
    setPlaced(true);
    addToast('Order placed successfully! 🎉', 'success');
  };

  const inStyle = {
    width: '100%', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
    borderRadius: 10, padding: '11px 14px', color: 'var(--text-primary)',
    fontSize: '0.9rem', marginBottom: 14, fontFamily: 'var(--font-body)',
    transition: 'all var(--transition-fast)',
  };
  const labStyle = { display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' };
  const focus = e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.boxShadow = '0 0 0 3px var(--brand-glow)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = ''; };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 32 }}>Checkout</h1>

      <div className="grid-responsive-checkout">
        {/* Form */}
        <div>
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '28px 24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--brand)' }}>Delivery Information</h2>
            <div className="grid-responsive-2">
              <div>
                <label style={labStyle}>Full Name *</label>
                <input style={inStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} onFocus={focus} onBlur={blur} placeholder="Youssef Trabelsi" />
              </div>
              <div>
                <label style={labStyle}>Email *</label>
                <input style={inStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} onFocus={focus} onBlur={blur} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label style={labStyle}>Phone</label>
              <input style={inStyle} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} onFocus={focus} onBlur={blur} placeholder="+216 XX XXX XXX" />
            </div>
            <div>
              <label style={labStyle}>Address *</label>
              <input style={inStyle} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} onFocus={focus} onBlur={blur} placeholder="12 Rue de la République" />
            </div>
            <div>
              <label style={labStyle}>City *</label>
              <input style={inStyle} value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} onFocus={focus} onBlur={blur} placeholder="Tunis" />
            </div>
            <div>
              <label style={labStyle}>Order Notes</label>
              <textarea style={{ ...inStyle, resize: 'vertical', minHeight: 80 }}
                value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                onFocus={focus} onBlur={blur} placeholder="Special instructions..." />
            </div>

            <div style={{ background: 'rgba(232,165,176,0.08)', border: '1px solid var(--brand-border)', borderRadius: 10, padding: '12px 16px', marginTop: 4 }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--brand)', marginBottom: 6 }}>💳 Payment Method</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cash on Delivery — Pay when your order arrives</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 20, color: 'var(--brand)' }}>Order Summary</h2>
            <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
              {state.cart.map(item => (
                <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{item.qty}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--brand)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            {state.promoCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Discount ({state.discount}%)</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>-{fmt(state.cart.reduce((s,i) => s + i.price*i.qty, 0) * state.discount / 100)}</span>
              </div>
            )}
            <div className="brand-divider" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--brand)', fontWeight: 700 }}>{fmt(discountedTotal)}</span>
            </div>
            <Button fullWidth size="lg" onClick={handleOrder}>Place Order →</Button>
            <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--text-muted)', fontSize: '0.8rem',
              transition: 'color var(--transition-fast)' }}
              onMouseEnter={e => e.target.style.color = 'var(--brand)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >← Continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
