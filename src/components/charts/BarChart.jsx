import { useState } from 'react';

export default function BarChart({ data = [], width = '100%', height = 220 }) {
  const [tooltip, setTooltip] = useState(null);
  const max = Math.max(...data.map(d => d.revenue));

  return (
    <div style={{ position: 'relative', width }}>
      <svg width="100%" height={height} viewBox={`0 0 ${data.length * 48} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8a5b0" stopOpacity="1" />
            <stop offset="100%" stopColor="#d28b98" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barH = ((d.revenue / max) * (height - 40));
          const x = i * 48 + 8;
          const y = height - barH - 20;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={32} height={barH}
                rx={4} fill="url(#barGrad)"
                style={{
                  transformOrigin: `${x + 16}px ${height - 20}px`,
                  animation: `barGrow 0.8s ${i * 0.05}s cubic-bezier(0.34,1.2,0.64,1) both`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => setTooltip({ idx: i, x: i * 48 + 24, y: y - 8 })}
                onMouseLeave={() => setTooltip(null)}
              />
              <text x={x + 16} y={height - 4} textAnchor="middle"
                fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-body)">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
      {tooltip && (() => {
        const d = data[tooltip.idx];
        return (
          <div style={{
            position: 'absolute',
            left: `calc(${(tooltip.idx / data.length) * 100}% + 16px)`,
            top: `${(1 - d.revenue / max) * (height - 40) - 10}px`,
            transform: 'translateX(-50%)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: '0.8rem', color: 'var(--text-primary)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md)', zIndex: 10,
          }}>
            <strong style={{ color: 'var(--brand)' }}>{d.month}</strong><br />
            {d.revenue.toLocaleString()} TND · {d.orders} orders
          </div>
        );
      })()}
    </div>
  );
}
