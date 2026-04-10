const fs = require('fs');

const content = `"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [tab, setTab] = useState("products");
  const [config, setConfig] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newP, setNewP] = useState({ name: "", category: "clothing", price: 0, image: "", description: "" });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [c, p] = await Promise.all([
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json())
    ]);
    setConfig(c); setProducts(p); setLoading(false);
  }

  async function saveCfg() {
    const r = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setMsg(r.ok ? "Saved!" : "Error");
    setTimeout(() => setMsg(""), 3000);
  }

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        setUploading(true);
        try {
          const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: reader.result }) });
          const data = await res.json();
          if (data.success) resolve(data.url);
          else reject(new Error("Failed"));
        } catch { reject(new Error("Failed")); }
        setUploading(false);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setUploading(false);
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) { setMsg("Please upload image"); setTimeout(() => setMsg(""), 3000); return; }
    try {
      const url = await uploadImage(file);
      setNewP((p) => ({ ...p, image: url }));
      setMsg("Image uploaded!");
    } catch { setMsg("Upload failed"); }
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const url = await uploadImage(file);
      setNewP((p) => ({ ...p, image: url }));
      setMsg("Image uploaded!");
    } catch { setMsg("Upload failed"); }
    setTimeout(() => setMsg(""), 3000);
  }

  async function addPro() {
    if (!newP.name || !newP.price) { setMsg("Name & price required"); setTimeout(() => setMsg(""), 3000); return; }
    const p = { id: Date.now().toString(), ...newP, categoryName: newP.category.charAt(0).toUpperCase() + newP.category.slice(1), currency: "EUR" };
    const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    if (r.ok) {
      setMsg("Product added!");
      setNewP({ name: "", category: "clothing", price: 0, image: "", description: "" });
      loadData();
    } else setMsg("Error");
    setTimeout(() => setMsg(""), 3000);
  }

  async function delPro(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMsg("Deleted"); loadData(); setTimeout(() => setMsg(""), 3000);
  }

  if (loading) return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setTab("config")} className={tab === "config" ? "text-white" : "text-gray-400"}>Site Config</button>
            <button onClick={() => setTab("products")} className={tab === "products" ? "text-white" : "text-gray-400"}>Products ({products.length})</button>
            <a href="/" target="_blank" className="text-gray-400">View Site</a>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded-lg">{msg}</div>}
        {uploading && <div className="mb-4 p-3 bg-yellow-100 rounded-lg">Uploading...</div>}
        
        {tab === "config" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">WhatsApp</h2>
            <input value={config.whatsapp?.number || ""} onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, number: e.target.value } })} className="w-full p-3 border rounded-lg" />
            <button onClick={saveCfg} className="mt-4 bg-[#C9A96E] text-white px-6 py-3 rounded-lg">Save</button>
          </div>
        )}
        
        {tab === "products" && (
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-medium mb-4">Add Product</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div><label className="text-sm text-gray-600">Name *</label><input value={newP.name} onChange={(e) => setNewP({ ...newP, name: e.target.value })} className="w-full p-2 border rounded" /></div>
                <div><label className="text-sm text-gray-600">Category</label><select value={newP.category} onChange={(e) => setNewP({ ...newP, category: e.target.value })} className="w-full p-2 border rounded"><option value="clothing">Clothing</option><option value="pants">Pants</option><option value="bags">Bags</option><option value="watches">Watches</option><option value="jewelry">Jewelry</option></select></div>
                <div><label className="text-sm text-gray-600">Price EUR *</label><input type="number" value={newP.price || ""} onChange={(e) => setNewP({ ...newP, price: Number(e.target.value) })} className="w-full p-2 border rounded" /></div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-2">Image - Drag & drop or click to upload (auto WebP)</label>
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => document.getElementById("fileInput")?.click()} className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#C9A96E] transition-colors">
                  {newP.image ? <img src={newP.image} alt="" className="h-28 object-contain" /> : <span className="text-gray-400">Drop image here or click to upload</span>}
                </div>
                <input id="fileInput" type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </div>
              <div className="mb-4"><label className="text-sm text-gray-600">Description</label><textarea value={newP.description} onChange={(e) => setNewP({ ...newP, description: e.target