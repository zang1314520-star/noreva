admin_tsx = r"""'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const save = async () => {
    const r = await fetch('/api/config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    setMsg(r.ok ? 'Saved!' : 'Error');
    setTimeout(() => setMsg(''), 2000);
  };

  const upd = (k: string, v: any) => setData((prev: any) => ({...prev, [k]: {...prev[k], ...v}}));

  if (loading) return <div className="p-8">Loading...</div>;
  if (!data) return <div className="p-8">Error</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <a href="/" className="text-sm text-gray-400">View Site</a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded">{msg}</div>}
        
        <div className="bg-white rounded p-6 mb-6 shadow">
          <h2 className="text-lg mb-4">WhatsApp Contact</h2>
          <input type="text" value={data.whatsapp.number} onChange={e => upd('whatsapp', {number: e.target.value})}
            className="w-full p-2 border rounded" placeholder="Phone number without +" />
        </div>
        
        <div className="bg-white rounded p-6 mb-6 shadow">
          <h2 className="text-lg mb-4">Brand Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-gray-600 mb-1">Brand</label><input type="text" value={data.site.brand} onChange={e => upd('site', {brand: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">Tagline</label><input type="text" value={data.site.tagline} onChange={e => upd('site', {tagline: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">Description</label><input type="text" value={data.site.description} onChange={e => upd('site', {description: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>
        </div>
        
        <div className="bg-white rounded p-6 mb-6 shadow">
          <h2 className="text-lg mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm text-gray-600 mb-1">Headline</label><input type="text" value={data.hero.headline} onChange={e => upd('hero', {headline: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">Subtitle</label><input type="text" value={data.hero.subtitle} onChange={e => upd('hero', {subtitle: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">CTA Button</label><input type="text" value={data.hero.cta} onChange={e => upd('hero', {cta: e.target.value})} className="w-full p-2 border rounded" /></div>
          </div>
        </div>
        
        <div className="bg-white rounded p-6 mb-6 shadow">
          <h2 className="text-lg mb-4">Manifesto</h2>
          <div className="space-y-4">
            <div><label className="block text-sm text-gray-600 mb-1">Headline</label><input type="text" value={data.manifesto.headline} onChange={e => upd('manifesto', {headline: e.target.value})} className="w-full p-2 border rounded" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">Text</label><textarea value={data.manifesto.text} onChange={e => upd('manifesto', {text: e.target.value})} className="w-full p-2 border rounded h-24" /></div>
          </div>
        </div>
        
        <button onClick={save} className="bg-[#C9A96E] text-white px-6 py-3 rounded hover:bg-[#B8985F] transition">Save Changes</button>
      </main>
    </div>
  );
}
"""

with open('app/admin/page.tsx', 'w', encoding='utf-8') as f:
    f.write(admin_tsx)

print('Admin page created successfully!')
