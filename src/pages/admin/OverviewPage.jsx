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
    return { label: cat, value: Math.round((catSales / Math.max(1, catProducts.reduce((s,p)=>s+p.sales*p.price+1,0))) * 100) || [38, 24, 20, 12, 6][CATEGORIES.indexOf(cat)] };
  });
  const donutData = CATEGORIES.map((cat, i) => ({
    label: cat,
    value: categoryRevenue[i].value,
    color: ['#2DD4BF','#60A5FA','#F472B6','#A78BFA','#FBBF24'][i],
  }));

  const lowStock = store.products.filter(p => p.stock <= 5 && p.stock > 0 && p.active);
  const topProducts = [...store.products].sort((a,b) => b.sales - a.sales).slice(0, 5);
  const recentOrders = [...store.orders].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5);

  const statusBadge = (s) => {
    const map = { Delivered:'success', Pending:'warning', Processing:'info', Shipped:'brand', Cancelled:'danger' };
    return <Badge variant={map[s]||'muted'}>{s}</Badge>;
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  };

  return (
    <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', marginBottom: 8, background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Dashboard Overview</h1>
        <p style={{ color:'var(--text-muted)', fontSize:'0.95rem' }}>Welcome back! Here's a high-level view of your business performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-responsive-auto" style={{ gap: '24px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            ...cardStyle,
            animation:`fadeSlideUp 0.6s ${i*0.08}s cubic-bezier(0.2, 0.8, 0.2, 1) both`,
            transition:'all 0.3s ease',
            cursor: 'pointer'
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(20, 184, 166, 0.1)';e.currentTarget.style.borderColor='var(--brand)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=cardStyle.boxShadow;e.currentTarget.style.borderColor='var(--border-glass)';}}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 8, fontWeight: 600 }}>{kpi.label}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:700, color:'var(--text-primary)' }}>{kpi.value}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                <span style={{ fontSize:'1.6rem', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>{kpi.icon}</span>
                <span style={{ fontSize:'0.8rem', fontWeight:700, color: kpi.positive ? 'var(--success)' : 'var(--danger)', background: kpi.positive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)', padding: '2px 8px', borderRadius: 12 }}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <Sparkline data={kpi.sparkline} color={kpi.positive ? 'var(--brand)' : '#e74c3c'} width={120} height={36} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-responsive-2-1" style={{ gap: '24px' }}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Revenue Analytics
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '4px 12px', borderRadius: 12 }}>Trailing 12 Months</span>
          </div>
          <BarChart data={revenueData} height={260} />
        </div>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Sales Distribution
            </h3>
          </div>
          <div style={{ padding: '10px 0' }}>
            <DonutChart data={donutData} size={200} thickness={36} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid-responsive-1-5-1" style={{ gap: '24px' }}>
        {/* Recent Orders */}
        <div style={cardStyle}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Recent Orders
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border-glass)' }}>
                  {['Order ID','Customer','Amount','Status'].map(h=>(
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',color:'var(--text-muted)',fontWeight:600,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: i !== recentOrders.length - 1 ? '1px solid var(--border-glass)' : 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{padding:'16px'}}>
                      <span style={{color:'var(--brand)',fontWeight:700,fontFamily:'var(--font-display)', letterSpacing: '0.05em'}}>{o.id}</span>
                    </td>
                    <td style={{padding:'16px',color:'var(--text-secondary)'}}>{o.customer}</td>
                    <td style={{padding:'16px',color:'var(--text-primary)',fontWeight:600}}>{fmt(o.total)}</td>
                    <td style={{padding:'16px'}}>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert & Top Products */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--danger)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 16, background: 'var(--danger)', borderRadius: 2 }} /> Low Stock Alerts
            </h3>
            {lowStock.length === 0 ? (
              <div style={{ padding: 16, background: 'rgba(46, 204, 113, 0.1)', border: '1px solid rgba(46, 204, 113, 0.2)', borderRadius: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.2rem' }}>✓</span> All products are well-stocked.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {lowStock.map(p => (
                  <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'rgba(231, 76, 60, 0.05)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:12, transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.background='rgba(231, 76, 60, 0.1)'; e.currentTarget.style.transform='translateX(4px)'}} onMouseLeave={e => {e.currentTarget.style.background='rgba(231, 76, 60, 0.05)'; e.currentTarget.style.transform='none'}}>
                    <span style={{fontSize:'1.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}}>{p.emoji}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'0.9rem',color:'var(--text-primary)',fontWeight: 500, overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                      <div style={{fontSize:'0.75rem',color:'var(--danger)', fontWeight: 600, marginTop: 4}}>Only {p.stock} units left in inventory</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 4, height: 16, background: 'var(--brand)', borderRadius: 2 }} /> Top Products
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {topProducts.map((p, i) => (
                <div key={p.id}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)', display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{ background: i===0?'var(--brand-gradient)':'var(--bg-tertiary)', color: i===0?'#000':'var(--text-muted)', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight:800, fontSize:'0.7rem' }}>{i+1}</span>
                      <span style={{fontWeight: 500}}>{p.name}</span>
                    </span>
                    <span style={{ fontSize:'0.8rem', color:'var(--text-primary)', fontWeight: 600 }}>{p.sales} sales</span>
                  </div>
                  <div style={{ height:6, background:'var(--bg-tertiary)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', borderRadius:4,
                      width:`${(p.sales/topProducts[0].sales)*100}%`,
                      background:'var(--brand-gradient)',
                      boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)',
                      transition:'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
