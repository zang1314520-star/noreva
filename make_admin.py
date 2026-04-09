content = """'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  description: string;
  image: string;
}

const CATS = [
  { k: 'clothing', n: 'Clothing' },
  { k: 'pants', n: 'Pants' },
  { k: 'bags', n: 'Bags' },
  { k: 'watches', n: 'Watches' },
  { k: 'jewelry', n: 'Jewelry' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<'cfg' | 'pro'>('pro');
  const [cfg, setCfg] = useState<any>(null);
  const [pros, setPros] = useState<Product[]>([]);
  const [load, setLoad] = useState(true);
  const [msg, setMsg] = useState('');
  const [np, setNp] = useState({ name: '', nameCn: '', cat: 'clothing', price: 0, desc: '', img: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [c, p] = await Promise.all([fetch('/api/config').then(r => r.json()), fetch('/api/products').then(r => r.json())]);
    setCfg(c); setPros(p); setLoad(false);
  };

  const saveCfg = async () => {
    const r = await fetch('/api/config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(cfg) });
    setMsg(r.ok ? 'Saved!' : 'Error'); setTimeout(() => setMsg(''), 2000);
  };

  const upCfg = (p: string, v: any) => {
    const nc = JSON.parse(JSON.stringify(cfg));
    const k = p.split('.'); let o: any = nc;
    for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
    o[k[k.length - 1]] = v; setCfg(nc);
  };

  const addPro = async () => {
    if (!np.name || !np.price) { setMsg('Name & price required'); setTimeout(() => setMsg(''), 2000); return; }
    const p: Product = { id: Date.now().toString(), name: np.name, nameCn: np.nameCn, cat: np.cat, catName: CATS.find(c => c.k === np.cat)?.n || 'Clothing', price: np.price, desc: np.desc, img: np.img };
    const r = await fetch('/api/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(p) });
    if (r.ok) { setMsg('Product added!'); setNp({ name: '', nameCn: '', cat: 'clothing', price: 0, desc: '', img: '' }); loadData(); }
    else setMsg('Error'); setTimeout(() => setMsg(''), 2000);
  };

  const delPro = async (id: string) => { if (!confirm('Delete?')) return; await fetch('/api/products', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id }) }); loadData(); };

  if (load) return <div className="p-8">Loading...</div>;
  if (!cfg) return <div className="p-8">Error</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setTab('cfg')} className={tab === 'cfg' ? 'text-white' : 'text-gray-400'}>Site Config</button>
            <button onClick={() => setTab('pro')} className={tab === 'pro' ? 'text-white' : 'text-gray-400'}>Products</button>
            <a href="/" target="_blank" className="text-gray-400">View Site</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded">{msg}</div>}

        {tab === 'cfg' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg mb-4">WhatsApp</h2>
              <input type="text" value={cfg.whatsapp?.number || ''} onChange={e => upCfg('whatsapp.number', e.target.value)} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg mb-4">Brand</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm text-gray-600">Brand</label><input type="text" value={cfg.site?.brand || ''} onChange={e => upCfg('site.brand', e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="text-sm text-gray-600">Tagline</label><input type="text" value={cfg.site?.tagline || ''} onChange={e => upCfg('site.tagline', e.target.value)} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="text-sm text-gray-600">Description</label><input type="text" value={cfg.site?.description || ''} onChange={e => upCfg('site.description', e.target.value)} className="w-full p-2 border rounded-lg" /></div>
              </div>
            </div>
            <button onClick={saveCfg} className="bg-[#C9A96E] text-white px-6 py-3 rounded-lg">Save Config</button>
          </div>
        )}

        {tab === 'pro' && (
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg mb-4">Add Product</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div><label className="text-sm text-gray-600">Name *</label><input type="text" value={np.name} onChange={e => setNp({...np, name: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="text-sm text-gray-600">Name (CN)</label><input type="text" value={np.nameCn} onChange={e => setNp({...np, nameCn: e.target.value})} className="w-full p-2 border rounded-lg" /></div>
                <div><label className="text-sm text-gray-600">Category</label><select value={np.cat} onChange={e => setNp({...np, cat: e.target.value})} className="w-full p-2 border rounded-lg">{CATS.map(c => <option key={c.k} value={c.k}>{c.n}</option>)}</select></div>
                <div><label className="text-sm text-gray-600">Price (EUR) *</label><input type="number" value={np.price} onChange={e => setNp({...np, price: Number(e.target.value)})} className="w-full p-2 border rounded-lg" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-sm text-gray-600">Description</label><textarea value={np.desc} onChange={e => setNp({...np, desc: e.target.value})} className="w-full p-2 border rounded-lg h-20" /></div>
                <div><label className="text-sm text-gray-600">Image URL</label><input type="text" value={np.img} onChange={e => setNp({...np, img: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="https://..." /></div>
              </div>
              {np.img && <img src={np.img} alt="Preview" className="w-32 h-32 object-cover mb-