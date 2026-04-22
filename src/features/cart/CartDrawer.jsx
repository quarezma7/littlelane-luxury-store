import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import Drawer from '../../components/ui/Drawer';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';
const PROMO_CODES = { SAVE10: 10, LUXURY20: 20, NEWUSER: 15 };

export default function CartDrawer() {
  const { state, dispatch, cartTotal, discountedTotal } = useStore();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      dispatch({ type: 'APPLY_PROMO', payload: { code, discount: PROMO_CODES[code] } });
      addToast(`Code "${code}" applied! ${PROMO_CODES[code]}% off 🎉`, 'success');
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code.');
    }
  };

  const checkout = () => {
    dispatch({ type: 'CLOSE_CART_DRAWER' });
    navigate('/checkout');
  };

  return (
    <Drawer isOpen={state.cartOpen} onClose={() => dispatch({ type: 'CLOSE_CART_DRAWER' })} title={`Cart (${state.cart.reduce((s,i)=>s+i.qty,0)})`} width={420}>
      {state.cart.length === 0 ? (
        <EmptyState emoji="🛒" title="Your cart is empty" subtitle="Add some adorable items to get started" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
            {state.cart.map((item) => {
              const product = state.products.find(p => p.id === item.productId);
              return (
                <CartItem key={`${item.productId}-${item.size}`}
                  item={item} product={product} dispatch={dispatch} addToast={addToast} />
              );
            })}
          </div>

          {/* Bottom */}
          <div style={{
            borderTop: '1px solid var(--border-glass)',
            padding: '16px 20px 20px',
            background: 'var(--bg-secondary)',
          }}>
            {/* Promo */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input
                  value={promoInput}
                  onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                  placeholder='Try "SAVE10"'
                  style={{
                    flex: 1, background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '9px 12px', color: 'var(--text-primary)',
                    fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
                  onKeyDown={e => e.key === 'Enter' && applyPromo()}
                />
                <button onClick={applyPromo} style={{
                  padding: '9px 14px', background: 'var(--bg-glass)',
                  border: '1px solid var(--brand-border)', borderRadius: 8,
                  color: 'var(--brand)', fontSize: '0.85rem', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'all var(--transition-fast)',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-glow)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                >Apply</button>
              </div>
              {promoError && <p style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>{promoError}</p>}
              {state.promoCode && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--success-bg)', border: '1px solid var(--success)',
                  borderRadius: 8, padding: '6px 12px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--success)' }}>✓ {state.promoCode} ({state.discount}% off)</span>
                  <button onClick={() => dispatch({ type: 'REMOVE_PROMO' })}
                    style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <SummaryRow label="Subtotal" value={fmt(cartTotal)} />
              {state.discount > 0 && <SummaryRow label={`Discount (${state.discount}%)`} value={`-${fmt(cartTotal * state.discount / 100)}`} valueColor="var(--success)" />}
              <SummaryRow label="Shipping" value="Free" valueColor="var(--success)" />
              <div className="brand-divider" />
              <SummaryRow label="Total" value={fmt(discountedTotal)} bold />
            </div>

            <Button onClick={checkout} fullWidth size="lg">Checkout →</Button>
            <button onClick={() => dispatch({ type: 'CLEAR_CART' })} style={{
              width: '100%', marginTop: 8, background: 'none', border: 'none',
              color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
              fontFamily: 'var(--font-body)', transition: 'color var(--transition-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >Clear cart</button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function CartItem({ item, product, dispatch, addToast }) {
  const remove = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId: item.productId, size: item.size } });
    addToast(`${item.name} removed from cart`, 'info');
  };

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle)',
      animation: 'fadeSlideUp 0.3s ease',
    }}>
      <div style={{
        width: 54, height: 54, background: 'var(--bg-glass)',
        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.6rem', flexShrink: 0, border: '1px solid var(--border-glass)',
      }}>{item.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: 2 }}>{item.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
          {item.size !== 'One Size' ? `Size: ${item.size}` : ''}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, size: item.size, qty: item.qty - 1 } })}
            style={qtyBtnStyle}>−</button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
          <button onClick={() => dispatch({ type: 'UPDATE_CART_QTY', payload: { productId: item.productId, size: item.size, qty: item.qty + 1 } })}
            style={qtyBtnStyle}>+</button>
          <span style={{ fontSize: '0.85rem', color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 600, marginLeft: 4 }}>
            {(item.price * item.qty).toLocaleString('fr-TN')} TND
          </span>
        </div>
      </div>
      <button onClick={remove} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
        fontSize: '0.9rem', alignSelf: 'flex-start',
        transition: 'color var(--transition-fast)',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >✕</button>
    </div>
  );
}

const qtyBtnStyle = {
  width: 24, height: 24, background: 'var(--bg-glass)',
  border: '1px solid var(--border-subtle)', borderRadius: 4,
  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--font-body)',
};

function SummaryRow({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.875rem', color: bold ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: bold ? '1rem' : '0.875rem', color: valueColor || (bold ? 'var(--brand)' : 'var(--text-primary)'), fontWeight: bold ? 700 : 400, fontFamily: bold ? 'var(--font-display)' : 'var(--font-body)' }}>{value}</span>
    </div>
  );
}
