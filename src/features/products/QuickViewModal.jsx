import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import StarRating from '../../components/ui/StarRating';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { dispatch } = useStore();
  const { addToast, currentUser } = useApp();
  const [size, setSize] = useState(product?.sizes?.[0] || 'One Size');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return null;

  const images = product.images || (product.image ? [product.image] : []);

  const effectivePrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const addToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, name: product.name, size, qty, price: effectivePrice, emoji: product.emoji } });
    dispatch({ type: 'CLOSE_CART_DRAWER' });
    addToast(`${product.name} added to cart`, 'success');
    onClose();
    setTimeout(() => dispatch({ type: 'TOGGLE_CART_DRAWER' }), 100);
  };

  const addToWishlist = () => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: { productId: product.id, name: product.name, price: effectivePrice, emoji: product.emoji } });
    addToast(`Added to wishlist ♡`, 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth={620}>
      <div className="grid-responsive-quickview">
        {/* Photo Gallery */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{
            background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '5rem', minHeight: 300, border: '1px solid var(--border-glass)',
            position: 'relative', overflow: 'hidden',
          }}>
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                animation: 'fadeIn 0.4s ease'
              }} />
            ) : (
              product.emoji
            )}
            {product.discount > 0 && (
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <Badge variant="danger">-{product.discount}%</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width: 60, height: 60, borderRadius: 8, overflow: 'hidden',
                  border: activeImg === i ? '2px solid var(--brand)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  opacity: activeImg === i ? 1 : 0.6,
                  flexShrink: 0
                }}>
                  <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Badge variant="muted" style={{ marginBottom: 8 }}>{product.category}</Badge>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 8 }}>{product.name}</h2>
            <StarRating rating={product.rating} size={14} />
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--brand)', fontWeight: 600 }}>
              {fmt(effectivePrice)}
            </span>
            {product.discount > 0 && (
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                {fmt(product.price)}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{product.description}</p>

          {/* Size */}
          {product.sizes?.length > 1 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{
                    padding: '5px 13px', borderRadius: 6,
                    border: size === s ? '2px solid var(--brand)' : '1px solid var(--border-subtle)',
                    background: size === s ? 'var(--brand-glow)' : 'var(--bg-glass)',
                    color: size === s ? 'var(--brand)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-fast)',
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <QtyBtn onClick={() => setQty(q => Math.max(1, q - 1))}>−</QtyBtn>
              <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <QtyBtn onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</QtyBtn>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                {product.stock} in stock
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={addToCart} style={{ flex: 1 }}>🛒 Add to Cart</Button>
            <button onClick={addToWishlist} style={{
              width: 42, height: 42, background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)', borderRadius: 10,
              color: 'var(--brand)', fontSize: '1.1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-glow)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
            >♡</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, background: 'var(--bg-glass)',
      border: '1px solid var(--border-glass)', borderRadius: 8,
      color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all var(--transition-fast)', fontFamily: 'var(--font-body)',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-glow)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
    >{children}</button>
  );
}
