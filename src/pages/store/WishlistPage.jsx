import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

export default function WishlistPage() {
  const { state, dispatch } = useStore();
  const { addToast } = useApp();

  const moveToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: item.productId, name: item.name, size: 'One Size', qty: 1, price: item.price, emoji: item.emoji } });
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.productId });
    addToast(`Moved to cart: ${item.name}`, 'success');
    dispatch({ type: 'TOGGLE_CART_DRAWER' });
  };

  const remove = (item) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.productId });
    addToast(`Removed from wishlist`, 'info');
  };

  return (
    <div className="page-container" style={{ padding: '40px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', marginBottom: 6 }}>My Wishlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{state.wishlist.length} saved items</p>
        </div>
        {state.wishlist.length > 0 && (
          <Button variant="ghost" onClick={() => { dispatch({ type: 'CLEAR_WISHLIST' }); addToast('Wishlist cleared', 'info'); }}>Clear All</Button>
        )}
      </div>

      {state.wishlist.length === 0 ? (
        <EmptyState 
          icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>}
          title="Your wishlist is empty" 
          subtitle="Save items you love for later"
          action={<Link to="/"><Button>Browse Collection</Button></Link>}
        />
      ) : (
        <div className="product-grid">
          {state.wishlist.map((item) => {
            const product = state.products.find(p => p.id === item.productId);
            return (
              <div key={item.productId} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)', display: 'flex', gap: 16,
                padding: 16, transition: 'all var(--transition-base)',
                animation: 'fadeSlideUp 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ width: 64, height: 64, background: 'var(--bg-glass)', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                  {item.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 4, color: 'var(--text-primary)' }}>{item.name}</h3>
                  <div style={{ color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 10 }}>
                    {fmt(item.price)}
                  </div>
                  {product?.stock === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: 8 }}>Out of stock</p>}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" onClick={() => moveToCart(item)} disabled={product?.stock === 0}>
                      Move to Cart
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(item)}>Remove</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
