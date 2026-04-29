"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 图片上传组件
function ImageUploader({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (e) { console.error("Upload failed", e); }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${dragOver ? "border-[#C9A96E] bg-amber-50" : "border-gray-300 hover:border-[#C9A96E]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">上传中...</p>
          </div>
        ) : value ? (
          <div className="relative">
            <img src={value} alt="" className="max-h-48 mx-auto object-contain rounded" />
            <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">删除</button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm text-gray-500">拖拽或点击上传图片</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="或直接粘贴图片URL" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
    </div>
  );
}

interface Spec { id: string; color: string; size: string; image: string; stock: number; }
interface Product { id: string; name: string; nameCn?: string; category: string; categoryName: string; price: number; currency: string; description: string; descriptionCn?: string; mainImage: string; specs: Spec[]; detailImages: string[]; }
interface SiteImages { hero: { image: string; title: string; }; womenswear: { main: string; secondary: string; }; menswear: { main: string; secondary: string; }; journal: { post1: string; post2: string; post3: string; }; }

const COLORS_CN = ["白色","黑色","米色","棕色","藏蓝","红色","粉色","绿色","蓝色","黄色","灰色","金色","银色"];
const COLORS_EN = ["White","Black","Beige","Brown","Navy","Red","Pink","Green","Blue","Yellow","Gray","Gold","Silver"];
const SIZES = ["XS","S","M","L","XL","XXL"];
const categories = { clothing: "Clothing", pants: "Pants", bags: "Bags", watches: "Watches", jewelry: "Jewelry" };

export default function AdminPage() {
  const [tab, setTab] = useState<"config"|"siteImages"|"products">("config");
  const [lang, setLang] = useState<"cn"|"en">("cn");
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({ whatsapp: "" });
  const [siteImages, setSiteImages] = useState<SiteImages>({ hero: { image: "", title: "The New Collection" }, womenswear: { main: "", secondary: "" }, menswear: { main: "", secondary: "" }, journal: { post1: "", post2: "", post3: "" } });
  const [products, setProducts] = useState<Product[]>([]);
  const [newP, setNewP] = useState<Partial<Product>>({ category: "clothing", specs: [], currency: "EUR" });
  const [editing, setEditing] = useState<string|null>(null);
  const [translating, setTranslating] = useState(false);
  const t = (k: keyof typeof translations) => {
    return translations[k] || k;
  };
  const translations = {
    siteConfig:"网站配置",siteImages:"网站图片",products:"产品管理",heroImage:"首页大图",whatsapp:"WhatsApp",save:"保存",saved:"已保存!",error:"错误",basicInfo:"基本信息",name:"名称",category:"分类",price:"价格(欧元)",description:"描述",mainImage:"主图",specImages:"规格图片",color:"颜色",size:"尺码",stock:"库存",add:"添加",saveProduct:"保存产品",allProducts:"全部产品",edit:"编辑",delete:"删除"
  };

  async function fetchProducts() {
    try {
      const [c, p, si] = await Promise.all([
        fetch("/api/config").then(r=>r.json()),
        fetch("/api/products").then(r=>r.json()),
        fetch("/api/site-images").then(r=>r.json())
      ]);
      setConfig(c); setProducts(p||[]); setSiteImages(si); setLoading(false);
    } catch { setLoading(false); }
  }

  useEffect(() => { fetchProducts(); }, []);

  async function saveConfig() {
    await fetch("/api/config", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(config) });
    alert(t("saved"));
  }

  async function saveSiteImages() {
    await fetch("/api/site-images", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(siteImages) });
    alert(t("saved"));
  }

  function reset() { setNewP({ category:"clothing", specs:[], currency:"EUR" }); setEditing(null); }

  function addSpec() { setNewP({...newP, specs:[...(newP.specs||[]), { id:Date.now().toString(), color:"", size:"M", image:"", stock:10 }]}); }

  async function saveProduct() {
    if (!newP.name && !newP.nameCn) { alert(t("name")+"required"); return; }
    const p: Product = { id: editing||Date.now().toString(), name:newP.name||"", nameCn:newP.nameCn||"", category:newP.category||"clothing", categoryName:categories[newP.category as keyof typeof categories]||"Clothing", price:newP.price||0, currency:newP.currency||"EUR", description:newP.description||"", descriptionCn:newP.descriptionCn||"", mainImage:newP.mainImage||"", specs:newP.specs||[], detailImages:[] };
    const method = editing ? "PUT" : "POST";
    await fetch("/api/products", { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(p) });
    await fetchProducts(); reset();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
    await fetchProducts();
  }

  function editProduct(p: Product) { setNewP(p); setEditing(p.id); setTab("products"); }

  async function loadSampleProducts() {
    if (!confirm("Load 200 sample belt products? This will add to existing products.")) return;
    try {
      const res = await fetch("/api/seed");
      const data = await res.json();
      alert(`Loaded ${data.count} products! Total: ${data.total}`);
      await fetchProducts();
    } catch (e) { alert("Failed to load products"); }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-[#C9A96E] border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium">NOREVA Admin</h1>
          <nav className="flex gap-4 text-sm">
            <button onClick={()=>setTab("config")} className={tab==="config"?"text-white":"text-gray-400"}>{t("siteConfig")}</button>
            <button onClick={()=>setTab("siteImages")} className={tab==="siteImages"?"text-white":"text-gray-400"}>{t("siteImages")}</button>
            <button onClick={()=>setTab("products")} className={tab==="products"?"text-white":"text-gray-400"}>{t("products")} ({products.length})</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>setLang(l=>l==="cn"?"en":"cn")} className="text-xs text-gray-400 hover:text-white">{lang==="cn"?"EN":"中文"}</button>
          <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white">View Site →</a>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {tab==="config"&&(
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl mb-6">{t("siteConfig")}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("whatsapp")}</label>
                <input value={config.whatsapp||""} onChange={e=>setConfig({...config,whatsapp:e.target.value})} className="w-full p-3 border rounded-lg" />
              </div>
              <button onClick={saveConfig} className="px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">{t("save")}</button>
            </div>
          </div>
        )}

        {tab==="siteImages"&&(
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl mb-6">{t("siteImages")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUploader value={siteImages.hero.image} onChange={v=>setSiteImages({...siteImages,hero:{...siteImages.hero,image:v}})} label="Hero主图" />
              <div>
                <label className="block text-sm font-medium mb-2">Hero标题</label>
                <input value={siteImages.hero.title} onChange={e=>setSiteImages({...siteImages,hero:{...siteImages.hero,title:e.target.value}})} className="w-full p-3 border rounded-lg" />
              </div>
              <ImageUploader value={siteImages.womenswear.main} onChange={v=>setSiteImages({...siteImages,womenswear:{...siteImages.womenswear,main:v}})} label="女装主图" />
              <ImageUploader value={siteImages.womenswear.secondary} onChange={v=>setSiteImages({...siteImages,womenswear:{...siteImages.womenswear,secondary:v}})} label="女装副图" />
              <ImageUploader value={siteImages.menswear.main} onChange={v=>setSiteImages({...siteImages,menswear:{...siteImages.menswear,main:v}})} label="男装主图" />
              <ImageUploader value={siteImages.menswear.secondary} onChange={v=>setSiteImages({...siteImages,menswear:{...siteImages.menswear,secondary:v}})} label="男装副图" />
            </div>
            <button onClick={saveSiteImages} className="mt-6 px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">{t("save")}</button>
          </div>
        )}

        {tab==="products"&&(
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">{t("products")}</h2>
              <div className="flex gap-3">
                <button onClick={loadSampleProducts} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Load 200 Belts</button>
                <button onClick={reset} className="px-4 py-2 border rounded-lg">+ New</button>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Product Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">{t("basicInfo")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">名称(EN)</label><input value={newP.name||""} onChange={e=>setNewP({...newP,name:e.target.value})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">名称(CN)</label><input value={newP.nameCn||""} onChange={e=>setNewP({...newP,nameCn:e.target.value})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">{t("category")}</label>
                      <select value={newP.category||"clothing"} onChange={e=>setNewP({...newP,category:e.target.value})} className="w-full p-2 border rounded">
                        <option value="clothing">Clothing</option><option value="pants">Pants</option><option value="bags">Bags</option><option value="watches">Watches</option><option value="jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div><label className="text-sm text-gray-600">{t("price")}</label><input type="number" value={newP.price||""} onChange={e=>setNewP({...newP,price:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                  </div>
                  <div className="mb-4"><label className="text-sm text-gray-600">描述(EN)</label><textarea value={newP.description||""} onChange={e=>setNewP({...newP,description:e.target.value})} className="w-full p-2 border rounded h-20" /></div>
                  <div><label className="text-sm text-gray-600">描述(CN)</label><textarea value={newP.descriptionCn||""} onChange={e=>setNewP({...newP,descriptionCn:e.target.value})} className="w-full p-2 border rounded h-20" /></div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">{t("specImages")}</h3>
                    <button onClick={addSpec} className="text-sm text-[#C9A96E] hover:underline">+ Add Spec</button>
                  </div>
                  <div className="space-y-4">
                    {(newP.specs||[]).map((s,i)=>(
                      <div key={s.id} className="grid grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                        <select value={s.color} onChange={e=>{const specs=[...newP.specs!];specs[i]={...s,color:e.target.value};setNewP({...newP,specs})}} className="p-2 border rounded">
                          <option value="">Color</option>
                          {COLORS_EN.map((c,i)=><option key={c} value={c}>{c} - {COLORS_CN[i]}</option>)}
                        </select>
                        <select value={s.size} onChange={e=>{const specs=[...newP.specs!];specs[i]={...s,size:e.target.value};setNewP({...newP,specs})}} className="p-2 border rounded">
                          <option value="">Size</option>
                          {SIZES.map(sz=><option key={sz} value={sz}>{sz}</option>)}
                        </select>
                        <input type="number" value={s.stock} onChange={e=>{const specs=[...newP.specs!];specs[i]={...s,stock:Number(e.target.value)};setNewP({...newP,specs})}} placeholder="Stock" className="p-2 border rounded" />
                        <input type="text" value={s.image} onChange={e=>{const specs=[...newP.specs!];specs[i]={...s,image:e.target.value};setNewP({...newP,specs})}} placeholder="Image URL" className="p-2 border rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <button onClick={saveProduct} className="w-full py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333]">{editing?"Update Product":"Save Product"}</button>
              </div>
              
              {/* Product List */}
              <div className="space-y-4">
                <h3 className="font-medium">{t("allProducts")} ({products.length})</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {products.map(p=>(
                    <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm flex gap-4">
                      {p.mainImage&&<img src={p.mainImage} alt="" className="w-16 h-16 object-cover rounded" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{p.name||p.nameCn}</p>
                        <p className="text-sm text-gray-500">{p.price>0?`${p.currency} ${p.price}`:"No price"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>editProduct(p)} className="text-xs text-[#C9A96E] hover:underline">{t("edit")}</button>
                        <button onClick={()=>deleteProduct(p.id)} className="text-xs text-red-500 hover:underline">{t("delete")}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}