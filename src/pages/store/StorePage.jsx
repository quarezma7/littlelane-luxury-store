import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ProductCard from '../../features/products/ProductCard';
import FilterSidebar from '../../features/products/FilterSidebar';
import SortDropdown from '../../features/products/SortDropdown';
import { FEATURED_COLLECTIONS } from '../../data/seed';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Drawer from '../../components/ui/Drawer';

export default function StorePage() {
  const { state } = useStore();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('popular');
  const maxPrice = Math.max(...state.products.map(p => p.price));
  const [filters, setFilters] = useState({ category: null, maxPrice, minRating: null, inStock: false });
  const [filterOpen, setFilterOpen] = useState(false);
  const activeFiltersCount = (filters.category ? 1 : 0) + (filters.minRating ? 1 : 0) + (filters.inStock ? 1 : 0) + (filters.maxPrice < maxPrice ? 1 : 0);

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const filteredProducts = useMemo(() => {
    let list = [...state.products];
    if (searchQuery) list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filters.category) list = list.filter(p => p.category === filters.category);
    if (filters.maxPrice) list = list.filter(p => {
      const ep = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
      return ep <= filters.maxPrice;
    });
    if (filters.minRating) list = list.filter(p => p.rating >= filters.minRating);
    if (filters.inStock) list = list.filter(p => p.stock > 0);
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating':     list.sort((a,b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a,b) => b.id.localeCompare(a.id)); break;
      default:           list.sort((a,b) => b.sales - a.sales);
    }
    return list.filter(p => p.active);
  }, [state.products, searchQuery, filters, sort]);

  return (
    <div>
      {/* Hero */}
      {!searchQuery && <HeroSection />}
      {/* Featured Collections */}
      {!searchQuery && <FeaturedCollections />}

      {/* Product Grid Section */}
      <div className="page-container" style={{ padding: '40px 24px 60px' }}>
        {searchQuery && (
          <div style={{ marginBottom: 24, animation: 'fadeSlideUp 0.3s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              Results for "{searchQuery}"
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{filteredProducts.length} items found</p>
          </div>
        )}
        {!searchQuery && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)' }}>Our Collection</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{filteredProducts.length} pieces available</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setFilterOpen(true)}
                style={{
                  padding: '8px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              >
                ✨ Filter & Sort {activeFiltersCount > 0 && <span style={{ background: 'var(--brand)', color: '#0a0c18', padding: '0 6px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 'bold' }}>{activeFiltersCount}</span>}
              </button>
              <div className="desktop-only"><SortDropdown value={sort} onChange={setSort} /></div>
            </div>
          </div>
        )}

        <div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {searchQuery && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 16 }}>
                <button
                  onClick={() => setFilterOpen(true)}
                  style={{
                    padding: '8px 16px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                >
                  ✨ Filter & Sort {activeFiltersCount > 0 && <span style={{ background: 'var(--brand)', color: '#0a0c18', padding: '0 6px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 'bold' }}>{activeFiltersCount}</span>}
                </button>
                <div className="desktop-only"><SortDropdown value={sort} onChange={setSort} /></div>
              </div>
            )}
            {loading ? (
              <div className="product-grid">
                {Array.from({length: 8}).map((_,i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyState emoji="🔍" title="No products found" subtitle="Try adjusting your filters or search query" />
            ) : (
              <div className="product-grid">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} title="Filter & Sort" width={340}>
        <div className="mobile-only" style={{ padding: '24px 24px 0', paddingBottom: 0 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Sort By</div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
        <FilterSidebar filters={filters} setFilters={setFilters} maxPrice={maxPrice} />
      </Drawer>
    </div>
  );
}

function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section style={{
      minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.08) 0%, transparent 60%), var(--bg-primary)',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        border: '1px solid rgba(37, 99, 235, 0.05)', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        border: '1px solid rgba(37, 99, 235, 0.08)', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', padding: '0 24px', maxWidth: 720 }}>
        <div style={{
          display: 'inline-block', padding: '6px 20px', borderRadius: 'var(--radius-full)',
          border: '1px solid var(--brand-border)', color: 'var(--brand)',
          fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 28,
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease',
        }}>✦ New Arrivals 2025</div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.01em',
          color: 'var(--text-primary)', marginBottom: 20,
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s 0.1s ease',
        }}>
          Cuddles &<br />
          <em style={{
            background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            fontStyle: 'italic', fontWeight: 600,
          }}>Lasting Comfort</em>
        </h1>

        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s 0.2s ease',
        }}>
          Discover a curated selection of premium essentials for moms and kids — where quality meets a touch of magic.
        </p>

        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s 0.3s ease',
        }}>
          <a href="#collection" style={{
            padding: '14px 36px', background: 'var(--brand-gradient)', color: '#0a0c18',
            borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.95rem',
            display: 'inline-block', transition: 'all var(--transition-base)',
            letterSpacing: '0.04em',
          }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.35)'; }}
            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = ''; }}
          >Shop Now</a>
          <a href="#collection" style={{
            padding: '14px 36px', background: 'transparent', color: 'var(--text-primary)',
            border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)',
            fontWeight: 500, fontSize: '0.95rem', display: 'inline-block',
            transition: 'all var(--transition-base)', letterSpacing: '0.04em',
          }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--brand)'; e.target.style.color = 'var(--brand)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.color = 'var(--text-primary)'; }}
          >Explore Collections</a>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 40, justifyContent: 'center', marginTop: 60,
          opacity: mounted ? 1 : 0, transition: 'all 0.8s 0.5s ease',
        }}>
          {[['500+', 'Handpicked Items'], ['100%', 'Safe & Quality'], ['🇹🇳', 'Ships Nationwide']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--brand)', marginBottom: 4 }}>{n}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        animation: 'float 2s ease-in-out infinite',
      }}>
        <span>Scroll</span><span style={{ fontSize: '1.2rem' }}>↓</span>
      </div>
    </section>
  );
}

function FeaturedCollections() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="collection" style={{ padding: '60px 0 40px', position: 'relative' }}>
      <div className="page-container">
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>Featured Collections</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }} className="desktop-only">Scroll to explore →</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => scroll('left')}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >←</button>
            <button
              onClick={() => scroll('right')}
              style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >→</button>
          </div>
        </div>
        <div ref={scrollRef} style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none', scrollBehavior: 'smooth' }}>
          {FEATURED_COLLECTIONS.map((col, i) => (
            <div key={col.id} style={{
              flexShrink: 0, width: 180, background: 'var(--bg-glass)',
              border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)',
              padding: '24px 20px', textAlign: 'center', cursor: 'pointer',
              transition: 'all var(--transition-base)', position: 'relative', overflow: 'hidden',
              animation: `fadeSlideUp 0.4s ${i * 0.08}s ease both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md), 0 0 20px ' + col.color + '30'; e.currentTarget.style.borderColor = col.color + '60'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 12, display: 'block' }}>{col.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{col.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>{col.subtitle}</div>
              <div style={{ fontSize: '0.72rem', color: col.color, fontWeight: 600, border: `1px solid ${col.color}40`, borderRadius: 'var(--radius-full)', padding: '2px 10px', display: 'inline-block' }}>{col.count} items</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
