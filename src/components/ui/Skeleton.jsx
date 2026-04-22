export default function Skeleton({ width = '100%', height = 20, borderRadius = 6, style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius, ...style }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <Skeleton height={180} borderRadius={8} />
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={14} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton width="50%" height={36} borderRadius={8} />
        <Skeleton width="50%" height={36} borderRadius={8} />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
      ))}
    </div>
  );
}
