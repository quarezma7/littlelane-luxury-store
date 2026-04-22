import { useState, useEffect } from 'react';

function polarToXY(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToXY(cx, cy, r, endAngle);
  const end = polarToXY(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export default function DonutChart({ data = [], size = 180, thickness = 40 }) {
  const [hovered, setHovered] = useState(null);
  const [animated, setAnimated] = useState(false);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - thickness / 2;

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  let cumAngle = 0;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, end: cumAngle, angle };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glow-donut" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {segments.map((seg, i) => {
            // Animation values
            const dashLength = (seg.angle / 360) * (2 * Math.PI * r);
            const circumference = 2 * Math.PI * r;
            
            return (
              <path
                key={i}
                d={describeArc(cx, cy, r, seg.start, seg.end - 0.5)}
                fill="none"
                stroke={seg.color}
                strokeWidth={hovered === i ? thickness + 8 : thickness}
                strokeLinecap="round"
                filter={hovered === i ? "url(#glow-donut)" : ""}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  strokeDasharray: circumference,
                  strokeDashoffset: animated ? 0 : circumference,
                  animation: `drawArc 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.1}s forwards`,
                  opacity: hovered !== null && hovered !== i ? 0.3 : 1
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ 
            fontSize: '1.4rem', fontWeight: 800, 
            color: hovered !== null ? segments[hovered].color : 'var(--brand)', 
            fontFamily: 'var(--font-display)',
            transition: 'color 0.3s'
          }}>
            {hovered !== null ? data[hovered].value + '%' : '100%'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, fontWeight: 500 }}>
            {hovered !== null ? data[hovered].label : 'Total'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d, i) => (
          <div key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', opacity: hovered !== null && hovered !== i ? 0.4 : 1,
              transition: 'all 0.2s',
              transform: hovered === i ? 'translateX(4px)' : 'none'
            }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ 
              width: 12, height: 12, borderRadius: '50%', background: d.color, flexShrink: 0,
              boxShadow: hovered === i ? `0 0 10px ${d.color}` : 'none'
            }} />
            <span style={{ fontSize: '0.85rem', color: hovered === i ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
