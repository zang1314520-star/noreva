const fs = require('fs');

let content = `"use client";

import { useState, useEffect, useCallback } from "react";

interface ProductSpec {
  id: string;
  color: string;
  size: string;
  image: string;
  stock: number;
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
  mainImage: string;
  specs: ProductSpec[];
  detailImages: string[];
}

export default function AdminPage() {
  const [tab, setTab] = useState("products");
  const [config, setConfig] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [newP, setNewP] = useState<Partial<Product>>({
    name: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "",
  });

  const [newSpec, setNewSpec] = useState<ProductSpec>({ id: "", color: "", size: "", image: "", stock: 99 });

  const COLORS = ["White", "Black", "Beige", "Brown", "Navy", "Red", "Pink", "Green", "Blue", "Yellow", "Orange", "Purple", "Gray", "Gold", "Silver"];
  const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [c, p] = await Promise.all([
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    setConfig(c); setProducts(p || []); setLoading(false);
  }

  async function saveCfg() {
    const r = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setMsg(r.ok ? "Saved!" : "Error"); setTimeout(() => setMsg(""), 3000);
  }

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: reader.result }) });
          const data = await res.json();
          if (data.success) resolve(data.url); else reject(new Error("Failed"));
        } catch { reject(new Error("Failed")); }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === "mainImage") setNewP({ ...newP, mainImage: url });
      else if (target === "specImage") setNewSpec({ ...newSpec, image: url });
      else if (target === "detailImage") setNewP({ ...newP, detailImages: [...(newP.detailImages || []), url] });
      setMsg("Uploaded!");
    } catch { setMsg("Upload failed"); }
    setUploading(false); setTimeout(() => setMsg(""), 3000);
  }

  async function handleDrop(e: React.DragEvent, target: string) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) { setMsg("Please upload image"); setTimeout(() => setMsg(""), 3000); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === "mainImage") setNewP({ ...newP, mainImage: url });
      else if (target === "specImage") setNewSpec({ ...newSpec, image: url });
      else if (target === "detailImage") setNewP({ ...newP, detailImages: [...(newP.detailImages || []), url] });
      setMsg("Uploaded!");
    } catch { setMsg("Upload failed"); }
    setUploading(false); setTimeout(() => setMsg(""), 3000);
  }

  function addSpec() {
    if (!newSpec.color || !newSpec.size || !newSpec.image) { setMsg("Fill color, size and image"); setTimeout(() => setMsg(""), 3000); return; }
    const spec = { ...newSpec, id: Date.now().toString() };
    setNewP({ ...newP, specs: [...(newP.specs || []), spec] });
    setNewSpec({ id: "", color: "", size: "", image: "", stock: 99 });
    setMsg("Spec added!"); setTimeout(() => setMsg(""), 3000);
  }

  function removeSpec(id: string) { setNewP({ ...newP, specs: (newP.specs || []).filter(s => s.id !== id) }); }
  function removeDetailImage(index: number) { const images = [...(newP.detailImages || [])]; images.splice(index, 1); setNewP({ ...newP, detailImages: images }); }

  async function saveProduct() {
    if (!newP.name || !newP.price) { setMsg("Name and price required"); setTimeout(() => setMsg(""), 3000); return; }
    const product: Product = { ...newP as Product, id: newP.id || Date.now().toString(), categoryName: newP.category!.charAt(0).toUpperCase() + newP.category!.slice(1), currency: "EUR" };
    const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) });
    if (r.ok) { setMsg("Product saved!"); setNewP({ name: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "" }); loadData(); }
    else setMsg("Error"); setTimeout(() => setMsg(""), 3000);
  }

  function editProduct(p: Product) { setNewP(p); setMsg("Editing product"); setTimeout(() => setMsg(""), 3000); }
  async function deleteProduct(id: string) { if (!confirm("Delete?")) return; await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setMsg("Deleted"); loadData(); setTimeout(() => setMsg(""), 3000); }
  function resetForm() { setNewP({ name: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "" }); setNewSpec({ id: "", color: "", size: "", image: "", stock: 99 }); }

  if (loading) return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setTab("config")} className={tab === "config" ? "text-white" : "text-gray-400"}>Site Config</button>
            <button onClick={() => setTab("products")} className={tab === "products" ? "text-white" : "text-gray-400"}>Products ({products.length})</button>
            <a href="/" target="_blank" className="text-gray-400">View Site</a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded-lg">{msg}</div>}
        {uploading && <div className="mb-4 p-3 bg-yellow-100 rounded-lg">Uploading...</div>}
        
        {tab === "config" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">WhatsApp</h2>
            <input value={