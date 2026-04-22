export default function EmptyState({ emoji = '📭', title = 'Nothing here', subtitle = '', action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center', gap: 16,
      animation: 'fadeSlideUp 0.4s ease',
    }}>
      <div style={{ fontSize: '3rem', animation: 'float 3s ease-in-out infinite' }}>{emoji}</div>
      <div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 6 }}>{title}</p>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
