export default function FunnelChart({ steps = [] }) {
  if (!steps.length) return null;
  const max = steps[0].value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        const drop = i > 0 ? (((steps[i-1].value - step.value) / steps[i-1].value) * 100).toFixed(0) : null;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: 120, flexShrink: 0, fontWeight: 500 }}>{step.label}</span>
            <div style={{ flex: 1, height: 32, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: `linear-gradient(90deg, var(--brand), #2DD4BF)`,
                borderRadius: 8,
                transition: 'width 1s cubic-bezier(0.34,1.2,0.64,1)',
                animation: `barGrow 0.8s ${i * 0.15}s cubic-bezier(0.2, 0.8, 0.2, 1) both`,
                transformOrigin: 'left center',
                boxShadow: '0 0 15px rgba(20, 184, 166, 0.3)'
              }} />
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.8rem', fontWeight: 700, color: '#000', textShadow: '0 1px 2px rgba(255,255,255,0.3)'
              }}>{step.value.toLocaleString()}</span>
            </div>
            <span style={{ fontSize: '0.8rem', width: 56, textAlign: 'right', flexShrink: 0, fontWeight: 600,
              color: drop ? 'var(--danger)' : 'var(--success)' }}>
              {drop ? `-${drop}%` : '100%'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
