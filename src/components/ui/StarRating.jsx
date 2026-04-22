export default function StarRating({ rating = 0, size = 14, showValue = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{
            fontSize: size,
            color: i <= Math.floor(rating) ? '#f4c01e' : (i - 0.5 <= rating ? '#f4c01e' : 'var(--text-muted)'),
            opacity: i <= Math.floor(rating) ? 1 : (i - 0.5 <= rating ? 0.6 : 0.3),
          }}>★</span>
        ))}
      </div>
      {showValue && <span style={{ fontSize: size - 2, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        {rating.toFixed(1)}
      </span>}
    </div>
  );
}
