import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../hooks/useModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CATEGORIES } from '../../data/seed';

const fmt = (n) => n.toLocaleString('fr-TN') + ' TND';
const EMOJIS = ['🧸','🍼','👶','🧒','👩‍👦','👗','👕','🎒','👟','🎨','🍦','🍭','🎈','🧴','🤱'];

const EMPTY_PRODUCT = { emoji:'🧸', images: [], name:'', category:'Kids Apparel', price:'', stock:'', description:'', discount:'0', active:true };

function ProductFormModal({ isOpen, onClose, product, onSave }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const [showEmojis, setShowEmojis] = useState(false);

  // Sync form when product changes (edit vs add) or modal opens
  useEffect(() => {
    setForm(product || EMPTY_PRODUCT);
  }, [product, isOpen]);

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) return;
    onSave({
      ...form,
      id: form.id || 'p' + Date.now(),
      price: Number(form.price), stock: Number(form.stock),
      discount: Number(form.discount || 0),
      rating: form.rating || 4.5, sales: form.sales || 0,
      sizes: form.sizes || ['One Size'],
    });
    onClose();
  };

  const inp = {
    width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-subtle)',
    borderRadius:10, padding:'10px 14px', color:'var(--text-primary)', fontSize:'0.875rem',
    fontFamily:'var(--font-body)', marginBottom:14, transition:'all var(--transition-fast)',
  };
  const lab = { display:'block', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={form.id ? 'Edit Product' : 'Add New Product'} maxWidth={540}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
        {/* Emoji picker */}
        <div style={{ gridColumn:'1/-1', marginBottom:14 }}>
          <label style={lab}>Product Icon</label>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div onClick={() => setShowEmojis(v=>!v)} style={{
              width:56, height:56, background:'var(--bg-glass)',
              border:'1px solid var(--border-glass)', borderRadius:12,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'2rem', cursor:'pointer',
              transition:'all var(--transition-fast)',
            }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--brand)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-glass)'}
            >{form.emoji}</div>
            <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Click to change emoji</span>
          </div>
          {showEmojis && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10, padding:'12px', background:'var(--bg-tertiary)', borderRadius:10, border:'1px solid var(--border-glass)', maxHeight:200, overflowY:'auto' }}>
              {EMOJIS.map(e => (
                <span key={e} onClick={() => { setForm(f=>({...f,emoji:e})); setShowEmojis(false); }}
                  style={{ fontSize:'1.6rem', cursor:'pointer', padding:4, borderRadius:6,
                    background: form.emoji===e ? 'var(--brand-glow)' : 'transparent',
                    transition:'background var(--transition-fast)' }}
                >{e}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ gridColumn:'1/-1' }}>
          <label style={lab}>Product Name *</label>
          <input style={inp} placeholder="e.g. Organic Cotton Jumpsuit" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            onFocus={e=>{e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px var(--brand-glow)';}}
            onBlur={e=>{e.target.style.borderColor='var(--border-subtle)'; e.target.style.boxShadow='';}}
          />
        </div>

        <div>
          <label style={lab}>Category</label>
          <select style={inp} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={lab}>Base Price (TND) *</label>
          <input type="number" style={inp} placeholder="0.00" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
        </div>

        <div>
          <label style={lab}>Stock Level *</label>
          <input type="number" style={inp} placeholder="0" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />
        </div>

        <div>
          <label style={lab}>Discount (%)</label>
          <input type="number" style={inp} placeholder="0" value={form.discount} onChange={e=>setForm(f=>({...f,discount:e.target.value}))} />
        </div>

        <div style={{ gridColumn:'1/-1', marginBottom: 10 }}>
          <label style={lab}>Product Images (URLs)</label>
          {(form.images || []).map((img, idx) => (
            <div key={idx} style={{ display:'flex', gap:8, marginBottom: 8 }}>
              <input style={{ ...inp, marginBottom: 0 }} placeholder="https://..." value={img} 
                onChange={e => {
                  const next = [...form.images];
                  next[idx] = e.target.value;
                  setForm(f => ({ ...f, images: next }));
                }}
                onFocus={e=>{e.target.style.borderColor='var(--brand)'; e.target.style.boxShadow='0 0 0 3px var(--brand-glow)';}}
                onBlur={e=>{e.target.style.borderColor='var(--border-subtle)'; e.target.style.boxShadow='';}}
              />
              <Button variant="danger" size="sm" onClick={() => {
                const next = form.images.filter((_, i) => i !== idx);
                setForm(f => ({ ...f, images: next }));
              }}>✕</Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, images: [...(f.images || []), ''] }))}>
            + Add Image URL
          </Button>
        </div>

        <div style={{ gridColumn:'1/-1' }}>
          <label style={lab}>Description</label>
          <textarea style={{ ...inp, height:80, resize:'none' }} placeholder="Product details..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginTop:10 }}>
        <Button onClick={handleSave} fullWidth>Save Product</Button>
        <Button variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function ProductsPage() {
  const { state, dispatch } = useStore();
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [selected, setSelected] = useState(new Set());
  const editModal = useModal();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
    addToast('Product deleted', 'success');
    setDeleteConfirm(null);
  };

  const handleSave = (prod) => {
    const exists = state.products.find(p => p.id === prod.id);
    if (exists) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: prod });
      addToast('Product updated', 'success');
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: prod });
      addToast('Product added', 'success');
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const bulkDelete = () => {
    if (window.confirm(`Delete ${selected.size} products?`)) {
      selected.forEach(id => dispatch({ type: 'DELETE_PRODUCT', payload: id }));
      addToast(`${selected.size} products deleted`, 'success');
      setSelected(new Set());
    }
  };

  const bulkToggle = () => {
    selected.forEach(id => {
      const p = state.products.find(x => x.id === id);
      if (p) dispatch({ type: 'UPDATE_PRODUCT', payload: { ...p, active: !p.active } });
    });
    addToast(`Toggled ${selected.size} products`, 'success');
  };

  const filtered = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !catFilter || p.category === catFilter;
    return matchesSearch && matchesCat;
  });

  const thStyle = { textAlign:'left', padding:'12px 14px', color:'var(--text-muted)', fontSize:'0.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid var(--border-glass)' };

  const stockBadge = (stock) => {
    if (stock === 0) return <Badge variant="danger">Out of stock</Badge>;
    if (stock <= 10) return <Badge variant="warning">{stock} Left</Badge>;
    return <Badge variant="success">{stock} In Stock</Badge>;
  };

  return (
    <div style={{ padding: 28, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', marginBottom:2, color:'var(--brand)' }}>LittleLane Inventory</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>{state.products.length} total products in catalog</p>
        </div>
        <Button onClick={() => editModal.open(EMPTY_PRODUCT)}>+ Add Product</Button>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:1, minWidth:280, position:'relative' }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products by name..."
            style={{ width:'100%', background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:10, padding:'10px 14px 10px 40px', color:'var(--text-primary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', transition:'all 0.2s' }}
            onFocus={e=>e.target.style.borderColor='var(--brand)'} onBlur={e=>e.target.style.borderColor='var(--border-glass)'}
          />
        </div>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:10, padding:'10px 14px', color:'var(--text-secondary)', fontSize:'0.875rem', fontFamily:'var(--font-body)', cursor:'pointer' }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {selected.size > 0 && (
          <div style={{ display:'flex', gap:8, animation:'fadeSlideDown 0.2s ease' }}>
            <span style={{ fontSize:'0.8rem', color:'var(--text-muted)', alignSelf:'center' }}>{selected.size} selected</span>
            <Button size="sm" variant="ghost" onClick={bulkToggle}>Toggle Active</Button>
            <Button size="sm" variant="danger" onClick={bulkDelete}>Delete Selected</Button>
          </div>
        )}
      </div>

      {/* Table container */}
      <div className="glass-card" style={{ overflow:'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState emoji="📦" title="No items found" subtitle="Try another search or category filter" />
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem', whiteSpace:'nowrap' }}>
              <thead>
                <tr>
                  <th style={{...thStyle, width:40}}>
                    <input type="checkbox" checked={selected.size===filtered.length && filtered.length>0}
                      onChange={()=>{
                        if(selected.size===filtered.length) setSelected(new Set());
                        else setSelected(new Set(filtered.map(p=>p.id)));
                      }} style={{accentColor:'var(--brand)',cursor:'pointer'}}
                    />
                  </th>
                  {['Item','Category','Price','Stock','Sales','Status','Actions'].map(h=>(
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`table-row-hover ${i%2===0?'table-row-even':''}`}
                    style={{ borderBottom:'1px solid var(--border-subtle)', opacity: p.active ? 1 : 0.5 }}
                  >
                    <td style={{padding:'12px 14px'}}>
                      <input type="checkbox" checked={selected.has(p.id)} onChange={()=>toggleSelect(p.id)} style={{accentColor:'var(--brand)',cursor:'pointer'}} />
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{
                          width:36, height:36, background:'var(--bg-glass)', borderRadius:8,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'1.2rem', overflow:'hidden', border:'1px solid var(--border-glass)'
                        }}>
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          ) : (
                            p.emoji
                          )}
                        </div>
                        <span style={{fontWeight:500,color:'var(--text-primary)'}}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px 14px',color:'var(--text-secondary)'}}>{p.category}</td>
                    <td style={{padding:'12px 14px',color:'var(--brand)',fontFamily:'var(--font-display)',fontWeight:600}}>
                      {fmt(p.discount > 0 ? p.price*(1-p.discount/100) : p.price)}
                    </td>
                    <td style={{padding:'12px 14px'}}>{stockBadge(p.stock)}</td>
                    <td style={{padding:'12px 14px',color:'var(--text-secondary)'}}>{p.sales}</td>
                    <td style={{padding:'12px 14px'}}>
                      <Badge variant={p.active ? 'success' : 'muted'}>{p.active ? 'Active' : 'Hidden'}</Badge>
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <Button size="sm" variant="ghost" onClick={()=>editModal.open({...p})}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={()=>setDeleteConfirm(p.id)}>✕</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductFormModal isOpen={editModal.isOpen} onClose={editModal.close} product={editModal.data} onSave={handleSave} />

      <Modal isOpen={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} title="Confirm Removal" maxWidth={360}>
        <div style={{textAlign:'center', padding:10}}>
          <div style={{fontSize:'3rem',marginBottom:16}}>⚠️</div>
          <p style={{color:'var(--text-secondary)',marginBottom:24,lineHeight:1.6}}>Are you sure you want to delete this product? This action cannot be undone and will affect inventory records.</p>
          <div style={{display:'flex',gap:12}}>
            <Button variant="danger" onClick={()=>handleDelete(deleteConfirm)} fullWidth>Yes, Delete</Button>
            <Button variant="ghost" onClick={()=>setDeleteConfirm(null)} fullWidth>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
