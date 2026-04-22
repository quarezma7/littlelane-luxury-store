import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import LineChart from '../../components/charts/LineChart';
import DonutChart from '../../components/charts/DonutChart';
import FunnelChart from '../../components/charts/FunnelChart';
import { TRAFFIC_SOURCES } from '../../data/seed';

const RANGES = ['7d','30d','90d','12m'];

const FUNNEL_DATA = [
  { label: 'Visits',         value: 12440 },
  { label: 'Product Views',  value: 6820 },
  { label: 'Add to Cart',    value: 2196 },
  { label: 'Checkout',       value: 1048 },
  { label: 'Purchase',       value: 472 },
];

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = ['00','04','08','12','16','20'];
const HEATMAP = HOURS.map(() => DAYS.map(() => Math.floor(Math.random() * 100)));

const COHORT = [
  ['Week 1','100%','62%','48%','41%'],
  ['Week 2','100%','58%','44%','37%'],
  ['Week 3','100%','65%','51%','43%'],
  ['Week 4','100%','55%','40%','34%'],
];

export default function AnalyticsPage() {
  const { state: admin } = useAdmin();
  const { state: store } = useStore();
  const [range, setRange] = useState('12m');

  const revenueSlice = range === '12m' ? admin.revenueData
    : range === '90d' ? admin.revenueData.slice(-3)
    : range === '30d' ? admin.revenueData.slice(-1)
    : admin.revenueData.slice(-1);

  const topProducts = [...store.products].sort((a,b)=>b.sales-a.sales).slice(0,5);
  const maxSales = topProducts[0]?.sales || 1;

  const heatmapColor = (val) => {
    const intensity = val / 100;
    return `rgba(232, 165, 176, ${0.05 + intensity * 0.7})`;
  };

  return (
    <div style={{ padding:28, display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>Analytics</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Data-driven insights for LittleLane</p>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {RANGES.map(r => (
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:'7px 14px', borderRadius:'var(--radius-full)', fontSize:'0.8rem', cursor:'pointer', fontFamily:'var(--font-body)',
              background: range===r ? 'var(--brand-gradient)' : 'var(--bg-glass)',
              border: range===r ? 'none' : '1px solid var(--border-subtle)',
              color: range===r ? '#0a0c18' : 'var(--text-secondary)',
              fontWeight: range===r ? 700 : 400,
              transition:'all var(--transition-fast)',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Revenue Trend */}
      <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Revenue Trend</h3>
        <LineChart data={admin.revenueData} height={220} />
      </div>

      {/* Two columns */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Top products */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Top Products by Revenue</h3>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, gap:8 }}>
                <span style={{ fontSize:'0.82rem', color:'var(--text-secondary)', display:'flex', gap:6, alignItems:'center', minWidth:0 }}>
                  <span style={{fontSize:'1rem'}}>{p.emoji}</span>
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                </span>
                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', flexShrink:0 }}>{p.sales} sold</span>
              </div>
              <div style={{ height:6, background:'var(--bg-tertiary)', borderRadius:3, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:3,
                  width:`${(p.sales/maxSales)*100}%`,
                  background:'var(--brand-gradient)',
                  animation:`barGrow 0.8s ${i*0.1}s ease both`,
                  transformOrigin:'left center',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Sources */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Traffic Sources</h3>
          <DonutChart data={TRAFFIC_SOURCES} size={160} thickness={32} />
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Conversion Funnel</h3>
        <FunnelChart steps={FUNNEL_DATA} />
      </div>

      {/* Heatmap + Cohort */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Heatmap */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Sales Heatmap (Hour × Day)</h3>
          <div style={{ overflowX:'auto' }}>
            <table style={{ borderCollapse:'separate', borderSpacing:3, fontSize:'0.72rem' }}>
              <thead>
                <tr>
                  <th style={{ color:'var(--text-muted)', padding:'4px 8px', textAlign:'left' }}>Hour</th>
                  {DAYS.map(d => <th key={d} style={{ color:'var(--text-muted)', padding:'4px 6px', fontWeight:500 }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((h, hi) => (
                  <tr key={h}>
                    <td style={{ color:'var(--text-muted)', padding:'4px 8px' }}>{h}:00</td>
                    {DAYS.map((d, di) => (
                      <td key={d} title={`${HEATMAP[hi][di]} orders`} style={{
                        width:30, height:24, borderRadius:4,
                        background: heatmapColor(HEATMAP[hi][di]),
                        cursor:'pointer', transition:'transform var(--transition-fast)',
                      }}
                        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.2)'}
                        onMouseLeave={e=>e.currentTarget.style.transform=''}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
            <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Low</span>
            {[0.05,0.2,0.4,0.6,0.75].map((v,i) => (
              <div key={i} style={{ width:16,height:10,borderRadius:2,background:`rgba(232,165,176,${v})` }} />
            ))}
            <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>High</span>
          </div>
        </div>

        {/* Cohort */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--brand)', marginBottom:20 }}>Retention Cohort</h3>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8rem' }}>
            <thead>
              <tr>
                <th style={{ color:'var(--text-muted)', padding:'6px 10px', textAlign:'left', fontWeight:500 }}>Cohort</th>
                {['W0','W1','W2','W3'].map(w => <th key={w} style={{ color:'var(--text-muted)', padding:'6px 10px', fontWeight:500 }}>{w}</th>)}
              </tr>
            </thead>
            <tbody>
              {COHORT.map((row) => (
                <tr key={row[0]} style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                  <td style={{ padding:'8px 10px', color:'var(--text-secondary)', fontWeight:500 }}>{row[0]}</td>
                  {row.slice(1).map((v, ci) => {
                    const pct = parseInt(v);
                    return (
                      <td key={ci} style={{ padding:'8px 10px' }}>
                        <div style={{
                          background:`rgba(232, 165, 176, ${pct/100*0.6+0.05})`,
                          borderRadius:6, padding:'4px 8px', textAlign:'center',
                          color: pct > 50 ? '#0a0c18' : 'var(--brand)',
                          fontWeight:600, fontSize:'0.78rem',
                        }}>{v}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
