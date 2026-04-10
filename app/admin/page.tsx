"use client";

import { useState, useEffect, useCallback } from "react";

interface Spec { id: string; color: string; size: string; image: string; stock: number; }
interface Product { id: string; name: string; nameCn?: string; category: string; categoryName: string; price: number; currency: string; description: string; descriptionCn?: string; mainImage: string; specs: Spec[]; detailImages: string[]; }

const COLORS_CN = ["白色","黑色","米色","棕色","藏蓝","红色","粉色","绿色","蓝色","黄色","灰色","金色","银色"];
const COLORS = ["White","Black","Beige","Brown","Navy","Red","Pink","Green","Blue","Yellow","Gray","Gold","Silver"];
const SIZES = ["XS","S","M","L","XL","XXL"];

// Translations
const T = {
  cn: {
    siteConfig: "网站配置",
    products: "产品管理",
    viewSite: "查看网站",
    whatsapp: "WhatsApp号码",
    save: "保存",
    saved: "已保存！",
    error: "错误",
    newProduct: "新增产品",
    basicInfo: "基本信息",
    name: "名称",
    nameCn: "中文名称",
    category: "分类",
    price: "价格",
    priceUnit: "价格 (欧元)",
    description: "描述",
    descriptionCn: "中文描述",
    mainImage: "主图",
    mainImageTip: "列表页展示的主图",
    specImages: "规格图片",
    specImagesTip: "颜色+尺码组合的图片",
    color: "颜色",
    size: "尺码",
    stock: "库存",
    image: "图片",
    add: "添加",
    addSpec: "添加规格",
    detailImages: "详情图片",
    detailImagesTip: "品牌介绍、清洗说明等",
    saveProduct: "保存产品",
    updateProduct: "更新产品",
    allProducts: "全部产品",
    specs: "规格",
    details: "详情",
    edit: "编辑",
    delete: "删除",
    nameRequired: "请填写名称和价格",
    fillAll: "请填写颜色、尺码和图片",
    uploadSuccess: "上传成功！",
    uploadFailed: "上传失败",
    imageOnly: "请上传图片文件",
    dropOrClick: "拖拽或点击上传",
    selected: "已选择",
    select: "选择",
    noImage: "无图片",
  },
  en: {
    siteConfig: "Site Config",
    products: "Products",
    viewSite: "View Site",
    whatsapp: "WhatsApp Number",
    save: "Save",
    saved: "Saved!",
    error: "Error",
    newProduct: "New Product",
    basicInfo: "Basic Info",
    name: "Name",
    nameCn: "Name (CN)",
    category: "Category",
    price: "Price",
    priceUnit: "Price (EUR)",
    description: "Description",
    descriptionCn: "Description (CN)",
    mainImage: "Main Image",
    mainImageTip: "Main image for list page",
    specImages: "Spec Images",
    specImagesTip: "Color + Size variant images",
    color: "Color",
    size: "Size",
    stock: "Stock",
    image: "Image",
    add: "Add",
    addSpec: "Add Spec",
    detailImages: "Detail Images",
    detailImagesTip: "Brand info, care instructions, etc.",
    saveProduct: "Save Product",
    updateProduct: "Update Product",
    allProducts: "All Products",
    specs: "Specs",
    details: "Details",
    edit: "Edit",
    delete: "Delete",
    nameRequired: "Name and price required",
    fillAll: "Fill color, size and image",
    uploadSuccess: "Uploaded!",
    uploadFailed: "Upload failed",
    imageOnly: "Please upload image file",
    dropOrClick: "Drop or click to upload",
    selected: "Selected",
    select: "Select",
    noImage: "No Image",
  }
};

const CATEGORIES_CN: Record<string, string> = { clothing: "服装", pants: "裤子", bags: "包包", watches: "手表", jewelry: "首饰" };
const CATEGORIES_EN: Record<string, string> = { clothing: "Clothing", pants: "Pants", bags: "Bags", watches: "Watches", jewelry: "Jewelry" };

export default function AdminPage() {
  const [lang, setLang] = useState<"cn" | "en">("cn");
  const [tab, setTab] = useState("products");
  const [config, setConfig] = useState<any>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newP, setNewP] = useState<Partial<Product>>({ name: "", nameCn: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "", descriptionCn: "" });
  const [newSpec, setNewSpec] = useState<Spec>({ id: "", color: COLORS[0], size: SIZES[0], image: "", stock: 99 });

  const t = T[lang];
  const categories = lang === "cn" ? CATEGORIES_CN : CATEGORIES_EN;
  const colorOptions = lang === "cn" ? COLORS_CN : COLORS;

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [c, p] = await Promise.all([fetch("/api/config").then((r) => r.json()), fetch("/api/products").then((r) => r.json())]);
    setConfig(c); setProducts(p || []); setLoading(false);
  }

  async function saveCfg() {
    const r = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setMsg(r.ok ? t.saved : t.error); setTimeout(() => setMsg(""), 3000);
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

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, target: string) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === "main") setNewP({ ...newP, mainImage: url });
      else if (target === "spec") setNewSpec({ ...newSpec, image: url });
      else if (target === "detail") setNewP({ ...newP, detailImages: [...(newP.detailImages || []), url] });
      setMsg(t.uploadSuccess);
    } catch { setMsg(t.uploadFailed); }
    setUploading(false); setTimeout(() => setMsg(""), 3000);
  }

  async function handleDrop(e: React.DragEvent, target: string) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file?.type.startsWith("image/")) { setMsg(t.imageOnly); setTimeout(() => setMsg(""), 3000); return; }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === "main") setNewP({ ...newP, mainImage: url });
      else if (target === "spec") setNewSpec({ ...newSpec, image: url });
      else if (target === "detail") setNewP({ ...newP, detailImages: [...(newP.detailImages || []), url] });
      setMsg(t.uploadSuccess);
    } catch { setMsg(t.uploadFailed); }
    setUploading(false); setTimeout(() => setMsg(""), 3000);
  }

  function addSpec() {
    if (!newSpec.color || !newSpec.size || !newSpec.image) { setMsg(t.fillAll); setTimeout(() => setMsg(""), 3000); return; }
    const spec = { ...newSpec, id: Date.now().toString() };
    setNewP({ ...newP, specs: [...(newP.specs || []), spec] });
    setNewSpec({ id: "", color: "", size: "", image: "", stock: 99 });
  }

  function removeSpec(id: string) { setNewP({ ...newP, specs: (newP.specs || []).filter(s => s.id !== id) }); }
  function removeDetail(index: number) { const arr = [...(newP.detailImages || [])]; arr.splice(index, 1); setNewP({ ...newP, detailImages: arr }); }

  async function save() {
    if (!newP.name || !newP.price) { setMsg(t.nameRequired); setTimeout(() => setMsg(""), 3000); return; }
    const product: Product = { ...newP as Product, id: newP.id || Date.now().toString(), categoryName: newP.category!.charAt(0).toUpperCase() + newP.category!.slice(1), currency: "EUR" };
    const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(product) });
    if (r.ok) { setMsg(t.saved); setNewP({ name: "", nameCn: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "", descriptionCn: "" }); loadData(); }
    else setMsg(t.error); setTimeout(() => setMsg(""), 3000);
  }

  function edit(p: Product) { setNewP(p); }
  async function del(id: string) { if (!confirm("Delete?")) return; await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); loadData(); }
  function reset() { setNewP({ name: "", nameCn: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "", descriptionCn: "" }); setNewSpec({ id: "", color: COLORS[0], size: SIZES[0], image: "", stock: 99 }); }

  if (loading) return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm items-center">
            {/* Language Toggle */}
            <div className="flex gap-1 bg-white/10 rounded-lg p-1">
              <button onClick={() => setLang("cn")} className={`px-3 py-1 rounded ${lang === "cn" ? "bg-[#C9A96E] text-white" : "text-gray-400"}`}>中文</button>
              <button onClick={() => setLang("en")} className={`px-3 py-1 rounded ${lang === "en" ? "bg-[#C9A96E] text-white" : "text-gray-400"}`}>EN</button>
            </div>
            <button onClick={() => setTab("config")} className={tab === "config" ? "text-white" : "text-gray-400"}>{t.siteConfig}</button>
            <button onClick={() => setTab("products")} className={tab === "products" ? "text-white" : "text-gray-400"}>{t.products} ({products.length})</button>
            <a href="/" target="_blank" className="text-gray-400">{t.viewSite}</a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
        {msg && <div className="mb-4 p-3 bg-green-100 rounded-lg">{msg}</div>}
        {uploading && <div className="mb-4 p-3 bg-yellow-100 rounded-lg">Uploading...</div>}
        
        {tab === "config" && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{t.whatsapp}</h2>
            <input value={config.whatsapp?.number || ""} onChange={(e) => setConfig({ ...config, whatsapp: { ...config.whatsapp, number: e.target.value } })} className="w-full p-3 border rounded-lg" />
            <button onClick={saveCfg} className="mt-4 bg-[#C9A96E] text-white px-6 py-3 rounded-lg">{t.save}</button>
          </div>
        )}

        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">{t.products}</h2>
              <button onClick={reset} className="px-4 py-2 border rounded-lg">+ {t.newProduct}</button>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">{t.basicInfo}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">{t.name}</label><input value={newP.name||""} onChange={e=>setNewP({...newP,name:e.target.value})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">{t.nameCn}</label><input value={newP.nameCn||""} onChange={e=>setNewP({...newP,nameCn:e.target.value})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">{t.category}</label><select value={newP.category||"clothing"} onChange={e=>setNewP({...newP,category:e.target.value})} className="w-full p-2 border rounded"><option value="clothing">{categories.clothing}</option><option value="pants">{categories.pants}</option><option value="bags">{categories.bags}</option><option value="watches">{categories.watches}</option><option value="jewelry">{categories.jewelry}</option></select></div>
                    <div><label className="text-sm text-gray-600">{t.priceUnit}</label><input type="number" value={newP.price||""} onChange={e=>setNewP({...newP,price:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                  </div>
                  <div className="mb-4"><label className="text-sm text-gray-600">{t.description}</label><textarea value={newP.description||""} onChange={e=>setNewP({...newP,description:e.target.value})} className="w-full p-2 border rounded h-20" /></div>
                  <div><label className="text-sm text-gray-600">{t.descriptionCn}</label><textarea value={newP.descriptionCn||""} onChange={e=>setNewP({...newP,descriptionCn:e.target.value})} className="w-full p-2 border rounded h-20" /></div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">{t.mainImage}</h3>
                  <p className="text-sm text-gray-500 mb-2">{t.mainImageTip}</p>
                  <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,"main")} onClick={()=>document.getElementById("mainInput")?.click()} className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#C9A96E]">
                    {newP.mainImage ? <img src={newP.mainImage} alt="" className="h-36 object-contain" /> : <span className="text-gray-400">{t.dropOrClick}</span>}
                  </div>
                  <input id="mainInput" type="file" accept="image/*" onChange={e=>handleUpload(e,"main")} className="hidden" />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">{t.specImages}</h3>
                  <p className="text-sm text-gray-500 mb-2">{t.specImagesTip}</p>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">{t.color}</label><select value={newSpec.color} onChange={e=>setNewSpec({...newSpec,color:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
<option value="White">White</option>
<option value="Black">Black</option>
<option value="Beige">Beige</option>
<option value="Brown">Brown</option>
<option value="Navy">Navy</option>
<option value="Red">Red</option>
<option value="Pink">Pink</option>
<option value="Green">Green</option>
<option value="Blue">Blue</option>
<option value="Yellow">Yellow</option>
<option value="Gray">Gray</option>
<option value="Gold">Gold</option>
<option value="Silver">Silver</option>
</select></div>
                    <div><label className="text-sm text-gray-600">{t.size}</label><select value={newSpec.size} onChange={e=>setNewSpec({...newSpec,size:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
<option value="XS">XS</option>
<option value="S">S</option>
<option value="M">M</option>
<option value="L">L</option>
<option value="XL">XL</option>
<option value="XXL">XXL</option>
</select></div>
                    <div><label className="text-sm text-gray-600">{t.stock}</label><input type="number" value={newSpec.stock} onChange={e=>setNewSpec({...newSpec,stock:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">{t.image}</label><div onClick={()=>document.getElementById("specInput")?.click()} className="p-2 border rounded cursor-pointer truncate">{newSpec.image ? t.selected : t.select}</div><input id="specInput" type="file" accept="image/*" onChange={e=>handleUpload(e,"spec")} className="hidden" /></div>
                  </div>
                  {newSpec.image && <img src={newSpec.image} alt="" className="w-16 h-16 object-cover mb-2 rounded" />}
                  <button onClick={addSpec} className="px-4 py-2 bg-[#1A1A1A] text-white rounded">{t.addSpec}</button>
                  <div className="mt-4 space-y-2">{(newP.specs||[]).map(s=><div key={s.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded"><img src={s.image} alt="" className="w-12 h-12 object-cover rounded" /><span className="font-medium">{s.color}</span><span className="text-gray-500">{s.size}</span><span className="text-sm text-gray-400">x{s.stock}</span><button onClick={()=>removeSpec(s.id)} className="ml-auto text-red-500">X</button></div>)}</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">{t.detailImages}</h3>
                  <p className="text-sm text-gray-500 mb-2">{t.detailImagesTip}</p>
                  <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,"detail")} onClick={()=>document.getElementById("detailInput")?.click()} className="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#C9A96E]">
                    <span className="text-gray-400">{t.dropOrClick}</span>
                  </div>
                  <input id="detailInput" type="file" accept="image/*" onChange={e=>handleUpload(e,"detail")} className="hidden" />
                  <div className="grid grid-cols-4 gap-4 mt-4">{newP.detailImages?.map((img,i)=><div key={i} className="relative group"><img src={img} alt="" className="w-full aspect-square object-cover rounded" /><button onClick={()=>removeDetail(i)} className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100">X</button></div>)}</div>
                </div>
                <button onClick={save} className="w-full bg-[#C9A96E] text-white py-3 rounded-xl font-medium">{newP.id ? t.updateProduct : t.saveProduct}</button>
              </div>
              <div>
                <h3 className="font-medium mb-4">{t.allProducts}</h3>
                <div className="space-y-4">
{products.map(p=><div key={p.id} className="bg-white rounded-xl p-4 shadow-sm">
  <div className="flex gap-3">
    {p.mainImage && <img src={p.mainImage} alt="" className="w-16 h-16 object-cover rounded" />}
    <div>
      <h4 className="font-medium">{p.name}</h4>
      <p className="text-sm text-gray-500">{p.categoryName}</p>
      <p className="text-sm text-[#C9A96E]">EUR {p.price}</p>
      <p className="text-xs text-gray-400">{p.specs?.length || 0} specs | {p.detailImages?.length || 0} details</p>
    </div>
  </div>
  <div className="flex gap-2 mt-3">
    <button onClick={()=>edit(p)} className="flex-1 py-1 text-sm border rounded hover:bg-gray-50">Edit</button>
    <button onClick={()=>del(p.id)} className="flex-1 py-1 text-sm border rounded hover:bg-gray-50 text-red-500">Delete</button>
  </div>
</div>)}
</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
