export default function FunnelChart({ steps = [] }) {
  if (!steps.length) return null;
  const max = steps[0].value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        const drop = i > 0 ? (((steps[i-1].value - step.value) / steps[i-1].value) * 100).toFixed(0) : null;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 110, flexShrink: 0 }}>{step.label}</span>
            <div style={{ flex: 1, height: 28, background: 'var(--bg-glass)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: `linear-gradient(90deg, var(--brand), var(--brand-light))`,
                borderRadius: 6,
                transition: 'width 1s cubic-bezier(0.34,1.2,0.64,1)',
                animation: `barGrow 0.8s ${i * 0.1}s ease both`,
                transformOrigin: 'left center',
              }} />
              <span style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--bg-primary)',
              }}>{step.value.toLocaleString()}</span>
            </div>
            <span style={{ fontSize: '0.75rem', width: 48, textAlign: 'right', flexShrink: 0,
              color: drop ? 'var(--danger)' : 'var(--text-muted)' }}>
              {drop ? `-${drop}%` : '100%'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
