import { useRef, useEffect } from 'react';

export default function Sparkline({ data = [], color = 'var(--brand)', width = 80, height = 32 }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Add points for the area fill
  const areaPts = `0,${height} ${pts} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi,'')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow-spark" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Area Fill */}
      <polygon
        points={areaPts}
        fill={`url(#sg-${color.replace(/[^a-z0-9]/gi,'')})`}
        style={{ animation: 'fadeIn 1s ease 0.5s both' }}
      />
      
      {/* Line */}
      <polyline
        fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        points={pts}
        filter="url(#glow-spark)"
        style={{ strokeDasharray: 500, strokeDashoffset: 500, animation: 'drawLine 1.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      />
    </svg>
  );
}
