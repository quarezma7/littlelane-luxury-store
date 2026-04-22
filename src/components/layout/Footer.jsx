import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { addToast } = useApp();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing!', 'success');
    setEmail('');
  };

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-glass)',
      marginTop: 80,
    }}>
      <div className="brand-divider" />
      <div className="page-container" style={{ padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700,
              background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '0.12em', marginBottom: 16,
            }}>LittleLane</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Thoughtfully curated essentials for modern moms and their little ones. Quality and comfort in every piece.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', marginBottom: 16, fontSize: '1rem' }}>Collections</h4>
            {['Moms', 'Kids', 'Toys', 'Apparel', 'Accessories'].map(c => (
              <div key={c} style={{ marginBottom: 8 }}>
                <a href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem',
                  transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--brand)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{c}</a>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', marginBottom: 16, fontSize: '1rem' }}>Service</h4>
            {['About Us', 'Contact', 'Shipping Policy', 'Returns', 'Gift Cards'].map(l => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.875rem',
                  transition: 'color var(--transition-fast)' }}
                  onMouseEnter={e => e.target.style.color = 'var(--brand)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{l}</a>
              </div>
            ))}
          </div>
          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--brand)', marginBottom: 8, fontSize: '1rem' }}>Newsletter</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16, lineHeight: 1.6 }}>
              Be the first to know about new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email" placeholder="Your email" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  borderRadius: 8, padding: '9px 14px', color: 'var(--text-primary)',
                  fontSize: '0.85rem', minWidth: 0,
                }}
                onFocus={e => e.target.style.borderColor = 'var(--brand)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-glass)'}
              />
              <button type="submit" style={{
                background: 'var(--brand-gradient)', color: '#0a0c18', border: 'none',
                borderRadius: 8, padding: '9px 16px', fontWeight: 600, cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              }}>Subscribe</button>
            </form>
          </div>
        </div>
        <div className="brand-divider" style={{ margin: '0 0 24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2025 LittleLane. All rights reserved.</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>🇹🇳 Tunisian Dinar (TND) · All prices inclusive of taxes</span>
        </div>
      </div>
    </footer>
  );
}
