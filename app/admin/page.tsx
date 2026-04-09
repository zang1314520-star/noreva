"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [tab, setTab] = useState("products");
  const [config, setConfig] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [newP, setNewP] = useState({
    name: "",
    category: "clothing",
    price: 0,
    image: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [c, p] = await Promise.all([
      fetch("/api/config").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    setConfig(c);
    setProducts(p);
    setLoading(false);
  }

  async function saveCfg() {
    const r = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setMsg(r.ok ? "Saved!" : "Error");
    setTimeout(() => setMsg(""), 2000);
  }

  async function addPro() {
    if (!newP.name || !newP.price) {
      setMsg("Name & price required");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    const p: any = {
      id: Date.now().toString(),
      ...newP,
      categoryName: newP.category.charAt(0).toUpperCase() + newP.category.slice(1),
      currency: "EUR",
    };
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (r.ok) {
      setMsg("Product added!");
      setNewP({ name: "", category: "clothing", price: 0, image: "", description: "" });
      loadData();
    } else {
      setMsg("Error");
    }
    setTimeout(() => setMsg(""), 2000);
  }

  async function delPro(id: string) {
    if (!confirm("Delete?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMsg("Deleted");
    loadData();
    setTimeout(() => setMsg(""), 2000);
  }

  if (loading) return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-light">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm">
            <button
              onClick={() => setTab("config")}
              className={tab === "config" ? "text-white" : "text-gray-400"}
            >
              Site Config
            </button>
            <button
              onClick={() => setTab("products")}
              className={tab === "products" ? "text-white" : "text-gray-400"}
            >
              Products ({products.length})
            </button>
            <a href="/" target="_blank" className="text-gray-400 hover:text-white">
              View Site
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {msg && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg text-center">{msg}</div>
        )}

        {tab === "config" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">WhatsApp Number</h2>
              <input
                type="text"
                value={config.whatsapp?.number || ""}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    whatsapp: { ...config.whatsapp, number: e.target.value },
                  })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <button
              onClick={saveCfg}
              className="bg-[#C9A96E] text-white px-6 py-3 rounded-lg hover:bg-[#B8985F] transition"
            >
              Save Config
            </button>
          </div>
        )}

        {tab === "products" && (
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-medium mb-4">Add New Product</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600">Name *</label>
                  <input
                    type="text"
                    value={newP.name}
                    onChange={(e) => setNewP({ ...newP, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select
                    value={newP.category}
                    onChange={(e) => setNewP({ ...newP, category: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="clothing">Clothing</option>
                    <option value="pants">Pants</option>
                    <option value="bags">Bags</option>
                    <option value="watches">Watches</option>
                    <option value="jewelry">Jewelry</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Price (EUR) *</label>
                  <input
                    type="number"
                    value={newP.price || ""}
                    onChange={(e) => setNewP({ ...newP, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-gray-600">Image URL</label>
                  <input
                    type="text"
                    value={newP.image}
                    onChange={(e) => setNewP({ ...newP, image: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <input
                    type="text"
                    value={newP.description}
                    onChange={(e) => setNewP({ ...newP, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              {newP.image && (
                <img src={newP.image} alt="Preview" className="w-24 h-24 object-cover mb-4 rounded" />
              )}
              <button
                onClick={addPro}
                className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#C9A96E] transition"
              >
                Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover mb-3 rounded" />
                  )}
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.categoryName}</p>
                  <p className="text-[#C9A96E]">EUR {p.price}</p>
                  <button
                    onClick={() => delPro(p.id)}
                    className="text-red-500 text-sm mt-2 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
