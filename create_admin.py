admin_tsx = r"""'use client';

import { useState, useEffect, useRef } from 'react';

interface SiteConfig {
  site: { brand: string; tagline: string; description: string };
  whatsapp: { number: string };
  hero: { headline: string; subtitle: string; cta: string };
  manifesto: { headline: string; text: string };
}

interface Product {
  id: string;
  name: string;
  nameCn?: string;
  category: string;
  categoryName: string;
  price: number;
  currency: string;
  description: string;
  descriptionCn?: string;
  image: string;
  images: string[];
}

const CATEGORIES = [
  { key: 'clothing', name: 'Clothing' },
  { key: 'pants', name: 'Pants' },
  { key: 'bags', name: 'Bags' },
  { key: 'watches', name: 'Watches' },
  { key: 'jewelry', name: 'Jewelry' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<'config' | 'products'>('config');
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [c, p] = await Promise.all([
      fetch('/api/config').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]);
    setConfig(c);
    setProducts(p);
    setLoading(false);
  };

  const saveConfig = async () => {
    const r = await fetch('/api/config', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(config) });
    setMsg(r.ok ? 'Saved!' : 'Error');
    setTimeout(() => setMsg(''), 2000);
  };

  const updateField = (path: string, value: any) => {
    if (!config) return;
    const nc = JSON.parse(JSON.stringify(config));
    const k = path.split('.');
    let o: any = nc;
    for (let i = 0; i < k.length - 1; i++) o = o[k[i]];
    o[k[k.length - 1]] = value;
    setConfig(nc);
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = async () => {
        setUploading(true);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: r.result }),
          });
          const data = await res.json();
          data.success ? resolve(data.url) : reject(new Error('Failed'));
        } catch { reject(new Error('Failed')); }
        setUploading(false);
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'images') => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    try {
      const url = await uploadImage(file);
      setEditingProduct(field === 'image' ? { ...editingProduct, image: url } : { ...editingProduct, images: [...editingProduct.images, url] });
    } catch { setMsg('Upload failed'); setTimeout(() => setMsg(''), 2000); }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    const r = await fetch('/api/products', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(editingProduct) });
    if (r.ok) { setMsg('Product saved!'); setEditingProduct(null); loadData(); }
    else setMsg('Error');
    setTimeout(() => setMsg(''), 2000);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete?')) return;
    await fetch('/api/products', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ id }) });
    setMsg('Deleted');
    loadData();
    setTimeout(() => setMsg(''), 2000);
  };

  const newProduct = () => {
    setEditingProduct({ id: Date.now().toString(), name: '', nameCn: '', category: 'clothing', categoryName: 'Clothing', price: 0, currency: 'EUR', description: '', descriptionCn: '', image: '', images: [] });
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!config) return <div className="p-8">Error</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <div className="flex gap-4 text-sm">
            <button onClick={() => setTab('config')} className={tab === 'config' ? 'text-white' : 'text-gray-400'}>{'<'} Site Config</button>
            <button onClick={() => setTab('products')} className={tab === 'products' ? 'text-white' : 'text-gray-400'}>Products {'>'}</button>
            <a href="/" target="_blank" className="text-gray-400 ml-4">View Site</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded">{msg}</div>}
        {uploading && <div className="mb-4 p-3 bg-yellow-100 rounded">Uploading...</div>}

        {tab === 'config' && (
          <div className="space-y-6">
            <div className="bg-white rounded p-6 shadow">
              <h2 className="text-lg mb-4">WhatsApp Number</h2>
              <input type="text" value={config.whatsapp.number} onChange={e => updateField('whatsapp.number', e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div className="bg-white rounded p-6 shadow">
              <h2 className="text-lg mb-4">Brand Info</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm text-gray-600">Brand</label><input type="text" value={config.site.brand} onChange={e => updateField('site.brand', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="text-sm text-gray-600">Tagline</label><input type="text" value={config.site.tagline} onChange={e => updateField('site.tagline', e.target.value)} className="w-full p-2 border rounded" /></div>
                <div><label className="text-sm text-gray-600">Description</label><input type="text" value={config.site.description} onChange={e => updateField('site.description', e.target.value)} className="w-full p-2 border rounded" /></div>
              </div>
            </div>
            <button onClick={saveConfig} className="bg-[#C9A96E] text-white px-6 py-3 rounded">Save Config</button>
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl">Products ({products.length})</h2>
              <button onClick={newProduct} className="bg-[#1A1A1A] text-white px-4 py-2 rounded">+ Add Product</button>
            </div>

            {editingProduct && (
              <div className="bg-white rounded p-6 shadow mb-6">
                <h3 className="text-lg mb-4">{editingProduct.id.length > 10 ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid grid-cols-2 gap