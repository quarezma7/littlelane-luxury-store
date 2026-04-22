import { useState } from 'react';

export default function BarChart({ data = [], width = '100%', height = 220 }) {
  const [tooltip, setTooltip] = useState(null);
  const max = Math.max(...data.map(d => d.revenue));

  return (
    <div style={{ position: 'relative', width }}>
      <svg width="100%" height={height} viewBox={`0 0 ${data.length * 48} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(232, 165, 176, 0.2)" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line key={i} x1="0" y1={(height - 40) * (1 - ratio)} x2="100%" y2={(height - 40) * (1 - ratio)} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
        ))}

        {data.map((d, i) => {
          const barH = ((d.revenue / max) * (height - 40)) || 0;
          const x = i * 48 + 8;
          const y = height - barH - 20;
          const isHovered = tooltip?.idx === i;
          
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={32} height={barH}
                rx={6} fill="url(#barGrad)"
                filter={isHovered ? "url(#glow)" : ""}
                style={{
                  transformOrigin: `${x + 16}px ${height - 20}px`,
                  animation: `barGrow 1s ${i * 0.08}s cubic-bezier(0.34,1.56,0.64,1) both`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: tooltip !== null && !isHovered ? 0.4 : 1
                }}
                onMouseEnter={() => setTooltip({ idx: i, x: i * 48 + 24, y: y - 8 })}
                onMouseLeave={() => setTooltip(null)}
              />
              <text x={x + 16} y={height - 4} textAnchor="middle"
                fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'} 
                fontSize="11" fontWeight={isHovered ? 700 : 500} fontFamily="var(--font-body)"
                style={{ transition: 'all 0.3s ease' }}>
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
            transform: 'translate(-50%, -100%)',
            background: 'rgba(15, 18, 30, 0.95)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--brand)',
            borderRadius: 10, padding: '10px 16px',
            fontSize: '0.85rem', color: 'var(--text-primary)',
            pointerEvents: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 8px 30px rgba(232, 165, 176, 0.3)', zIndex: 10,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ color: 'var(--brand)', fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>{d.month}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span><span style={{ color: 'var(--text-muted)' }}>Revenue:</span> {d.revenue.toLocaleString()} TND</span>
              <span><span style={{ color: 'var(--text-muted)' }}>Orders:</span> {d.orders}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
