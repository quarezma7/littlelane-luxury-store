import { CATEGORIES } from '../../data/seed';

export default function FilterSidebar({ filters, setFilters, maxPrice }) {
  const priceMax = maxPrice || 10000;

  const toggle = (key, val) => {
    setFilters(f => ({ ...f, [key]: f[key] === val ? null : val }));
  };

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)', padding: '20px 16px',
      display: 'flex', flexDirection: 'column', gap: 24,
      height: 'fit-content', position: 'sticky', top: 88,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--brand)', fontWeight: 600 }}>
        Filters
      </div>
      <div className="brand-divider" />

      {/* Category */}
      <div>
        <SectionTitle>Category</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <FilterChip active={!filters.category} onClick={() => setFilters(f => ({ ...f, category: null }))}>All</FilterChip>
          {CATEGORIES.map(cat => (
            <FilterChip key={cat} active={filters.category === cat} onClick={() => toggle('category', cat)}>{cat}</FilterChip>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <SectionTitle>Max Price</SectionTitle>
        <input
          type="range" min={0} max={priceMax} step={100}
          value={filters.maxPrice || priceMax}
          onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
          style={{ width: '100%', accentColor: 'var(--brand)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0 TND</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--brand)' }}>
            {(filters.maxPrice || priceMax).toLocaleString()} TND
          </span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <SectionTitle>Min Rating</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[null, 4.5, 4, 3.5].map(r => (
            <FilterChip key={r ?? 'all'} active={filters.minRating === r} onClick={() => setFilters(f => ({ ...f, minRating: r }))}>
              {r === null ? 'Any rating' : `★ ${r}+`}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>In Stock Only</span>
        <div
          onClick={() => setFilters(f => ({ ...f, inStock: !f.inStock }))}
          style={{
            width: 40, height: 22, borderRadius: 11,
            background: filters.inStock ? 'var(--brand)' : 'var(--bg-tertiary)',
            border: `1px solid ${filters.inStock ? 'var(--brand)' : 'var(--border-subtle)'}`,
            cursor: 'pointer', position: 'relative',
            transition: 'all var(--transition-base)',
          }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50%',
            background: filters.inStock ? '#0a0c18' : 'var(--text-muted)',
            position: 'absolute', top: 2,
            left: filters.inStock ? 20 : 2,
            transition: 'left 0.2s ease',
          }} />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => setFilters({ category: null, maxPrice: priceMax, minRating: null, inStock: false })}
        style={{
          background: 'none', border: '1px solid var(--border-subtle)', borderRadius: 8,
          color: 'var(--text-muted)', fontSize: '0.8rem', padding: '8px', cursor: 'pointer',
          fontFamily: 'var(--font-body)', transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >↺ Reset Filters</button>
    </aside>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{children}</div>;
}

function FilterChip({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', padding: '6px 10px', borderRadius: 6, border: 'none',
      background: active ? 'rgba(232,165,176,0.15)' : 'transparent',
      color: active ? 'var(--brand)' : 'var(--text-secondary)',
      fontSize: '0.85rem', cursor: 'pointer',
      transition: 'all var(--transition-fast)', fontFamily: 'var(--font-body)',
      borderLeft: active ? '2px solid var(--brand)' : '2px solid transparent',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
    >{children}</button>
  );
}
