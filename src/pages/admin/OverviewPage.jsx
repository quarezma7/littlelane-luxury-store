import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import Sparkline from '../../components/charts/Sparkline';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import Badge from '../../components/ui/Badge';
import { CATEGORIES } from '../../data/seed';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';

export default function OverviewPage() {
  const { state: store } = useStore();
  const { state: admin } = useAdmin();

  const totalRevenue = store.orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
  const totalOrders = store.orders.length;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / store.orders.filter(o=>o.status==='Delivered').length) : 0;
  const activeUsers = admin.users.filter(u => u.status === 'active').length;

  const { revenueData } = admin;
  const sparkData = revenueData.map(d => d.revenue);

  const kpis = [
    { label: 'Total Revenue', value: fmt(totalRevenue), change: '+18.4%', positive: true, sparkline: sparkData, icon: '💰' },
    { label: 'Total Orders', value: totalOrders, change: '+12.1%', positive: true, sparkline: revenueData.map(d=>d.orders), icon: '📦' },
    { label: 'Active Users', value: activeUsers, change: '+5.3%', positive: true, sparkline: [4,5,5,6,6,7,7,8], icon: '👥' },
    { label: 'Avg Order Value', value: fmt(avgOrderValue), change: '+6.7%', positive: true, sparkline: [2100,2400,2200,2800,2600,3000,2900,3200], icon: '📈' },
    { label: 'Conversion Rate', value: '3.8%', change: '-0.4%', positive: false, sparkline: [4.2,3.9,4.1,3.8,4.0,3.7,3.8,3.8], icon: '🎯' },
    { label: 'Return Rate', value: '2.1%', change: '-0.8%', positive: true, sparkline: [3.2,3.0,2.8,2.5,2.3,2.2,2.1,2.1], icon: '↩️' },
  ];

  const categoryRevenue = CATEGORIES.map(cat => {
    const catProducts = store.products.filter(p => p.category === cat);
    const catSales = catProducts.reduce((s, p) => s + p.sales * p.price, 0);
    return { label: cat, value: Math.round((catSales / catProducts.reduce((s,p)=>s+p.sales*p.price+1,0)) * 100) };
  });
  const donutData = CATEGORIES.map((cat, i) => ({
    label: cat,
    value: [38, 24, 20, 12, 6][i],
    color: ['#e8a5b0','#a1d2ce','#f6c4cd','#84c0b8','#d28b98'][i],
  }));

  const lowStock = store.products.filter(p => p.stock <= 5 && p.stock > 0 && p.active);
  const topProducts = [...store.products].sort((a,b) => b.sales - a.sales).slice(0, 5);
  const recentOrders = [...store.orders].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5);

  const statusBadge = (s) => {
    const map = { Delivered:'success', Pending:'warning', Processing:'info', Shipped:'brand', Cancelled:'danger' };
    return <Badge variant={map[s]||'muted'}>{s}</Badge>;
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom: 4 }}>Dashboard Overview</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Welcome back! Here's what's happening with LittleLane today.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background:'var(--bg-glass)', border:'1px solid var(--border-glass)',
            borderRadius:'var(--radius-md)', padding:'20px',
            animation:`fadeSlideUp 0.4s ${i*0.06}s ease both`,
            transition:'all var(--transition-base)',
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='var(--shadow-md)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 6 }}>{kpi.label}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:600, color:'var(--text-primary)' }}>{kpi.value}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                <span style={{ fontSize:'1.4rem' }}>{kpi.icon}</span>
                <span style={{ fontSize:'0.75rem', fontWeight:600, color: kpi.positive ? 'var(--success)' : 'var(--danger)' }}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <Sparkline data={kpi.sparkline} color={kpi.positive ? 'var(--brand)' : '#e74c3c'} width={100} height={30} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:'24px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:20, color:'var(--brand)' }}>Revenue — 12 Months</h3>
          <BarChart data={revenueData} height={220} />
        </div>
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:'24px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:20, color:'var(--brand)' }}>Sales by Category</h3>
          <DonutChart data={donutData} size={160} thickness={32} />
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20 }}>
        {/* Recent Orders */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:'24px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:16, color:'var(--brand)' }}>Recent Orders</h3>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.85rem' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border-glass)' }}>
                {['Order','Customer','Total','Status'].map(h=>(
                  <th key={h} style={{padding:'8px 10px',textAlign:'left',color:'var(--text-muted)',fontWeight:500,fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={o.id} className={`table-row-hover ${i%2===0?'table-row-even':''}`}>
                  <td style={{padding:'10px'}}>
                    <span style={{color:'var(--brand)',fontWeight:600,fontFamily:'var(--font-display)',fontSize:'0.85rem'}}>{o.id}</span>
                  </td>
                  <td style={{padding:'10px',color:'var(--text-secondary)'}}>{o.customer}</td>
                  <td style={{padding:'10px',color:'var(--text-primary)',fontWeight:500}}>{fmt(o.total)}</td>
                  <td style={{padding:'10px'}}>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alert */}
        <div style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:'var(--radius-md)', padding:'24px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', marginBottom:16, color:'var(--danger)' }}>⚠ Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p style={{ color:'var(--success)', fontSize:'0.875rem' }}>✓ All products well-stocked</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {lowStock.map(p => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'var(--danger-bg)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:8 }}>
                  <span style={{fontSize:'1.3rem'}}>{p.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.85rem',color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                    <div style={{fontSize:'0.75rem',color:'var(--danger)'}}>Only {p.stock} left!</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', margin:'20px 0 14px', color:'var(--brand)' }}>🏆 Top Products</h3>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)', display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{color:'var(--brand)',fontWeight:700,fontSize:'0.75rem'}}>#{i+1}</span>
                  <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:130}}>{p.name}</span>
                </span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{p.sales} sold</span>
              </div>
              <div style={{ height:5, background:'var(--bg-tertiary)', borderRadius:3, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:3,
                  width:`${(p.sales/topProducts[0].sales)*100}%`,
                  background:'var(--brand-gradient)',
                  transition:'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
