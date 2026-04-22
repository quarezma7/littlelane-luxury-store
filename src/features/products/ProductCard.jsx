import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import StarRating from '../../components/ui/StarRating';
import Badge from '../../components/ui/Badge';
import QuickViewModal from './QuickViewModal';
import { useModal } from '../../hooks/useModal';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

export default function ProductCard({ product }) {
  const { dispatch } = useStore();
  const { addToast } = useApp();
  const { isOpen, open, close, data } = useModal();
  const [hovered, setHovered] = useState(false);

  const effectivePrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const addToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: {
      productId: product.id, name: product.name,
      size: product.sizes?.[0] || 'One Size',
      qty: 1, price: effectivePrice, emoji: product.emoji,
    }});
    addToast(`${product.name} added to cart 🛒`, 'success');
  };

  const addToWishlist = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_WISHLIST', payload: {
      productId: product.id, name: product.name, price: effectivePrice, emoji: product.emoji,
    }});
    addToast(`Added to wishlist ♡`, 'success');
  };

  if (!product.active) return null;

  return (
    <>
      <div
        onClick={() => open(product)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
          cursor: 'pointer', transition: 'all var(--transition-base)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? 'var(--shadow-lg), var(--shadow-brand)' : 'var(--shadow-sm)',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeSlideUp 0.4s ease',
        }}
      >
        {/* Image Area */}
        <div style={{
          position: 'relative', height: 180,
          background: 'linear-gradient(135deg, var(--bg-glass), rgba(232,165,176,0.04))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform var(--transition-base)',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          overflow: 'hidden',
        }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'opacity 0.3s ease',
            }} />
          ) : (
            <span style={{ fontSize: '4rem' }}>{product.emoji}</span>
          )}
          {product.discount > 0 && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <Badge variant="danger">-{product.discount}%</Badge>
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <Badge variant="warning">Low Stock</Badge>
            </div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Badge variant="muted">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {product.category}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>
                {product.name}
              </h3>
            </div>
          </div>

          <StarRating rating={product.rating} size={12} />

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--brand)', fontWeight: 600 }}>
              {fmt(effectivePrice)}
            </span>
            {product.discount > 0 && (
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.8rem' }}>
                {fmt(product.price)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1, padding: '8px 12px',
                background: 'var(--brand-gradient)', color: '#0a0c18',
                border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1,
                transition: 'all var(--transition-fast)',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
            >Add to Cart</button>
            <button
              onClick={addToWishlist}
              style={{
                width: 36, height: 36, background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)', borderRadius: 8,
                color: 'var(--brand)', fontSize: '1rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-glow)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-glass)'}
            >♡</button>
          </div>
        </div>
      </div>

      <QuickViewModal product={data} isOpen={isOpen} onClose={close} />
    </>
  );
}
