import { useState } from 'react';

export default function LineChart({ data = [], width = '100%', height = 200, color = '#c9a84c' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data.length) return null;

  const padX = 40, padY = 20;
  const svgW = 600, svgH = height;
  const max = Math.max(...data.map(d => d.revenue));
  const min = Math.min(...data.map(d => d.revenue));
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (svgW - padX * 2),
    y: padY + (1 - (d.revenue - min) / range) * (svgH - padY * 2),
    ...d,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length-1].x},${svgH - padY} L${points[0].x},${svgH - padY} Z`;

  return (
    <div style={{ position: 'relative', width }}>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaD} fill="url(#lineAreaGrad)" />
        {/* Line */}
        <path
          d={pathD} fill="none" stroke={color}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="1200" strokeDashoffset="1200"
          style={{ animation: 'drawLine 1.8s ease forwards' }}
        />
        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i} cx={p.x} cy={p.y} r={hoveredIdx === i ? 6 : 4}
            fill={hoveredIdx === i ? color : 'var(--bg-secondary)'}
            stroke={color} strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'r 0.15s' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          />
        ))}
        {/* Y-axis labels */}
        {[0, 0.5, 1].map(t => {
          const val = min + t * range;
          const y = padY + (1 - t) * (svgH - padY * 2);
          return (
            <text key={t} x={padX - 8} y={y + 4} textAnchor="end"
              fill="var(--text-muted)" fontSize="11" fontFamily="var(--font-body)">
              {(val / 1000).toFixed(0)}k
            </text>
          );
        })}
      </svg>
      {/* Tooltip */}
      {hoveredIdx !== null && (() => {
        const p = points[hoveredIdx];
        return (
          <div style={{
            position: 'absolute',
            left: `${(p.x / 600) * 100}%`,
            top: `${(p.y / height) * 100}%`,
            transform: 'translate(-50%, -130%)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: '0.78rem', color: 'var(--text-primary)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md)', zIndex: 10,
          }}>
            <strong style={{ color }}>{p.month}</strong>: {p.revenue.toLocaleString()} TND
          </div>
        );
      })()}
    </div>
  );
}
