import { useState } from 'react';

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
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - thickness / 2;

  let cumAngle = 0;
  const segments = data.map((d, i) => {
    const angle = (d.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, start, end: cumAngle, angle };
  });

  const centerLabel = hovered !== null
    ? { label: data[hovered].label, value: data[hovered].value + '%' }
    : { label: 'Total', value: total + '%' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size}>
          {segments.map((seg, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, seg.start, seg.end)}
              fill="none"
              stroke={seg.color}
              strokeWidth={hovered === i ? thickness + 4 : thickness}
              strokeLinecap="butt"
              style={{
                cursor: 'pointer',
                transition: 'stroke-width 0.2s ease',
                filter: hovered === i ? `drop-shadow(0 0 8px ${seg.color}80)` : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-display)' }}>
            {hovered !== null ? data[hovered].value + '%' : '100%'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {hovered !== null ? data[hovered].label : 'Total'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((d, i) => (
          <div key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', opacity: hovered !== null && hovered !== i ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginLeft: 'auto' }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
