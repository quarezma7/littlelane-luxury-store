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

  const cardStyle = {
    background: 'rgba(15, 18, 30, 0.4)',
    backdropFilter: 'blur(12px)',
    border: '1px solid var(--border-glass)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <div style={{ padding: '0 28px', display:'flex', flexDirection:'column', gap:32 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', marginBottom:8, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Analytics</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>Data-driven insights for LittleLane</p>
        </div>
        <div style={{ display:'flex', gap:8, background: 'rgba(15, 18, 30, 0.5)', padding: 6, borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
          {RANGES.map(r => (
            <button key={r} onClick={()=>setRange(r)} style={{
              padding:'8px 20px', borderRadius:'var(--radius-full)', fontSize:'0.85rem', cursor:'pointer', fontFamily:'var(--font-body)',
              background: range===r ? 'var(--brand-gradient)' : 'transparent',
              border: 'none',
              color: range===r ? '#000' : 'var(--text-secondary)',
              fontWeight: range===r ? 700 : 500,
              boxShadow: range===r ? '0 4px 15px rgba(232, 165, 176, 0.3)' : 'none',
              transition:'all var(--transition-fast)',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Revenue Trend */}
      <div style={cardStyle}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Revenue Trend
        </h3>
        <LineChart data={admin.revenueData} height={260} />
      </div>

      {/* Two columns */}
      <div className="grid-responsive-2" style={{ gap: '24px' }}>
        {/* Top products */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Top Products by Revenue
          </h3>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, gap:8 }}>
                <span style={{ fontSize:'0.9rem', color:'var(--text-primary)', display:'flex', gap:10, alignItems:'center', minWidth:0, fontWeight: 500 }}>
                  <span style={{fontSize:'1.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'}}>{p.emoji}</span>
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</span>
                </span>
                <span style={{ fontSize:'0.8rem', color:'var(--text-muted)', flexShrink:0, fontWeight: 600 }}>{p.sales} sold</span>
              </div>
              <div style={{ height:8, background:'var(--bg-tertiary)', borderRadius:4, overflow:'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                <div style={{
                  height:'100%', borderRadius:4,
                  width:`${(p.sales/maxSales)*100}%`,
                  background:'var(--brand-gradient)',
                  boxShadow: '0 0 10px rgba(232, 165, 176, 0.4)',
                  animation:`barGrow 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${i*0.1}s both`,
                  transformOrigin:'left center',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Traffic Sources */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Traffic Sources
          </h3>
          <div style={{ padding: '20px 0' }}>
            <DonutChart data={TRAFFIC_SOURCES} size={200} thickness={36} />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={cardStyle}>
        <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Conversion Funnel
        </h3>
        <FunnelChart steps={FUNNEL_DATA} />
      </div>

      {/* Heatmap + Cohort */}
      <div className="grid-responsive-2" style={{ gap: '24px' }}>
        {/* Heatmap */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Sales Heatmap (Hour × Day)
          </h3>
          <div style={{ overflowX:'auto' }}>
            <table style={{ borderCollapse:'separate', borderSpacing:4, fontSize:'0.75rem', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ color:'var(--text-muted)', padding:'6px 8px', textAlign:'left', fontWeight: 600 }}>Hour</th>
                  {DAYS.map(d => <th key={d} style={{ color:'var(--text-muted)', padding:'6px', fontWeight:600, textAlign: 'center' }}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((h, hi) => (
                  <tr key={h}>
                    <td style={{ color:'var(--text-secondary)', padding:'4px 8px', fontWeight: 500 }}>{h}:00</td>
                    {DAYS.map((d, di) => (
                      <td key={d} title={`${HEATMAP[hi][di]} orders`} style={{
                        height:32, borderRadius:6,
                        background: heatmapColor(HEATMAP[hi][di]),
                        border: '1px solid rgba(255,255,255,0.02)',
                        cursor:'pointer', transition:'all var(--transition-fast)',
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.15)'; e.currentTarget.style.boxShadow='0 4px 10px rgba(0,0,0,0.3)'; e.currentTarget.style.zIndex=10; e.currentTarget.style.position='relative'}}
                        onMouseLeave={e=>{e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.zIndex=1}}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:20 }}>
            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Low</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0.05,0.2,0.4,0.6,0.75].map((v,i) => (
                <div key={i} style={{ width:20,height:12,borderRadius:3,background:`rgba(232,165,176,${v})` }} />
              ))}
            </div>
            <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>High</span>
          </div>
        </div>

        {/* Cohort */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom:24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Retention Cohort
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ color:'var(--text-muted)', padding:'10px 14px', textAlign:'left', fontWeight:600, borderBottom: '1px solid var(--border-glass)' }}>Cohort</th>
                  {['W0','W1','W2','W3'].map(w => <th key={w} style={{ color:'var(--text-muted)', padding:'10px 14px', fontWeight:600, textAlign: 'center', borderBottom: '1px solid var(--border-glass)' }}>{w}</th>)}
                </tr>
              </thead>
              <tbody>
                {COHORT.map((row, idx) => (
                  <tr key={row[0]} style={{ borderBottom: idx === COHORT.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding:'12px 14px', color:'var(--text-secondary)', fontWeight:600 }}>{row[0]}</td>
                    {row.slice(1).map((v, ci) => {
                      const pct = parseInt(v);
                      return (
                        <td key={ci} style={{ padding:'12px 14px' }}>
                          <div style={{
                            background:`rgba(232, 165, 176, ${pct/100*0.7+0.05})`,
                            borderRadius:8, padding:'6px 10px', textAlign:'center',
                            color: pct > 50 ? '#000' : 'var(--text-primary)',
                            fontWeight:700, fontSize:'0.8rem',
                            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)'
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
    </div>
  );
}
