"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 图片上传组件 - 支持拖拽 + 预览 + URL输入
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
      if (data.url) {
        onChange(data.url);
      }
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
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
            <div className="absolute top-2 right-2 flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="bg-white/90 text-xs px-2 py-1 rounded shadow hover:bg-white">更换</button>
              <button onClick={(e) => { e.stopPropagation(); onChange(""); }} className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600">删除</button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-sm text-gray-500">拖拽图片到这里，或点击选择文件</p>
            <p className="text-xs text-gray-400 mt-1">支持 JPG, PNG, WebP 自动转为 WebP 格式</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      {/* URL输入框 */}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="或直接粘贴图片URL" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A96E] focus:border-transparent" />
    </div>
  );
}

interface Spec { id: string; color: string; size: string; image: string; stock: number; }
interface Product { id: string; name: string; nameCn?: string; category: string; categoryName: string; price: number; currency: string; description: string; descriptionCn?: string; mainImage: string; specs: Spec[]; detailImages: string[]; }
interface SiteImages { hero: { image: string; title: string; }; womenswear: { main: string; secondary: string; }; menswear: { main: string; secondary: string; }; journal: { post1: string; post2: string; post3: string; }; }

const COLORS_CN = ["白色","黑色","米色","棕色","藏蓝","红色","粉色","绿色","蓝色","黄色","灰色","金色","银色"];
const COLORS_EN = ["White","Black","Beige","Brown","Navy","Red","Pink","Green","Blue","Yellow","Gray","Gold","Silver"];
const SIZES_CN = ["XS","S","M","L","XL","XXL"];
const SIZES_EN = ["XS","S","M","L","XL","XXL"];

// Translations
const T = {
  cn: {
    siteConfig: "网站配置",
    siteImages: "网站图片",
    products: "产品管理",
    viewSite: "查看网站",
    heroImage: "首页大图",
    heroImageTip: "首页右侧展示的大图",
    womenswear: "女装区域",
    menswear: "男装区域",
    journal: "杂志区域",
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
    colorTip: "选择颜色",
    size: "尺码",
    sizeTip: "选择尺码",
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
    siteImages: "Site Images",
    products: "Products",
    viewSite: "View Site",
    heroImage: "Hero Image",
    heroImageTip: "Large image on homepage right",
    womenswear: "Womenswear",
    menswear: "Menswear",
    journal: "Journal",
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
    colorTip: "Select color",
    size: "Size",
    sizeTip: "Select size",
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
  const [siteImages, setSiteImages] = useState<SiteImages>({ hero: { image: "", title: "The New Collection" }, womenswear: { main: "", secondary: "" }, menswear: { main: "", secondary: "" }, journal: { post1: "", post2: "", post3: "" } });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newP, setNewP] = useState<Partial<Product>>({ name: "", nameCn: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "", descriptionCn: "" });
  const [newSpec, setNewSpec] = useState<Spec>({ id: "", color: "白色", size: "S", image: "", stock: 99 });
  const [translating, setTranslating] = useState(false);

  const t = T[lang];
  const categories = lang === "cn" ? CATEGORIES_CN : CATEGORIES_EN;
  const colorOptions = lang === "cn" ? COLORS_CN : COLORS_EN;
  const sizeOptions = lang === "cn" ? SIZES_CN : SIZES_EN;

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [c, p, si] = await Promise.all([fetch("/api/config").then((r) => r.json()), fetch("/api/products").then((r) => r.json()), fetch("/api/site-images").then((r) => r.json())]);
    setConfig(c); setProducts(p || []); setSiteImages(si); setLoading(false);
  }

  async function saveCfg() {
    const r = await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    setMsg(r.ok ? t.saved : t.error); setTimeout(() => setMsg(""), 3000);
  }

  async function saveSiteImages() {
    const r = await fetch("/api/site-images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(siteImages) });
    setMsg(r.ok ? t.saved : t.error); setTimeout(() => setMsg(""), 3000);
  }

  // Auto translate CN to EN
  async function translateToEn() {
    if (!newP.nameCn && !newP.descriptionCn) {
      setMsg(lang === "cn" ? "请先输入中文名称或描述" : "Please enter Chinese name or description first");
      setTimeout(() => setMsg(""), 2000);
      return;
    }
    setTranslating(true);
    try {
      let name = newP.name || "";
      let desc = newP.description || "";
      
      if (newP.nameCn) {
        const nameRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(newP.nameCn)}&langpair=zh-CN|en`);
        const nameData = await nameRes.json();
        if (nameData.responseStatus === 200) {
          name = nameData.responseData.translatedText;
        }
      }
      
      if (newP.descriptionCn) {
        const descRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(newP.descriptionCn)}&langpair=zh-CN|en`);
        const descData = await descRes.json();
        if (descData.responseStatus === 200) {
          desc = descData.responseData.translatedText;
        }
      }
      
      setNewP({ ...newP, name, description: desc });
      setMsg(lang === "cn" ? "翻译成功！" : "Translated!");
    } catch {
      setMsg(lang === "cn" ? "翻译失败" : "Translation failed");
    }
    setTranslating(false);
    setTimeout(() => setMsg(""), 2000);
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
  function reset() { setNewP({ name: "", nameCn: "", category: "clothing", price: 0, mainImage: "", specs: [], detailImages: [], description: "", descriptionCn: "" }); setNewSpec({ id: "", color: lang === "cn" ? "白色" : "White", size: "S", image: "", stock: 99 }); }

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
            <button onClick={() => setTab("siteImages")} className={tab === "siteImages" ? "text-white" : "text-gray-400"}>{t.siteImages}</button>
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

        {tab === "siteImages" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-2">{t.heroImage}</h2>
              <p className="text-xs text-gray-500 mb-4">{t.heroImageTip}</p>
              <ImageUploader value={siteImages.hero.image} onChange={(v) => setSiteImages({...siteImages, hero: {...siteImages.hero, image: v}})} label="Hero 图片" />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input type="text" value={siteImages.hero.title} onChange={(e) => setSiteImages({...siteImages, hero: {...siteImages.hero, title: e.target.value}})} className="w-full p-3 border rounded-lg" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">{t.womenswear}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader value={siteImages.womenswear.main} onChange={(v) => setSiteImages({...siteImages, womenswear: {...siteImages.womenswear, main: v}})} label="女装主图" />
                <ImageUploader value={siteImages.womenswear.secondary} onChange={(v) => setSiteImages({...siteImages, womenswear: {...siteImages.womenswear, secondary: v}})} label="女装副图" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">{t.menswear}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader value={siteImages.menswear.main} onChange={(v) => setSiteImages({...siteImages, menswear: {...siteImages.menswear, main: v}})} label="男装主图" />
                <ImageUploader value={siteImages.menswear.secondary} onChange={(v) => setSiteImages({...siteImages, menswear: {...siteImages.menswear, secondary: v}})} label="男装副图" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">{t.journal}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImageUploader value={siteImages.journal.post1} onChange={(v) => setSiteImages({...siteImages, journal: {...siteImages.journal, post1: v}})} label="文章1图片" />
                <ImageUploader value={siteImages.journal.post2} onChange={(v) => setSiteImages({...siteImages, journal: {...siteImages.journal, post2: v}})} label="文章2图片" />
                <ImageUploader value={siteImages.journal.post3} onChange={(v) => setSiteImages({...siteImages, journal: {...siteImages.journal, post3: v}})} label="文章3图片" />
              </div>
            </div>

            <button onClick={saveSiteImages} className="bg-[#C9A96E] text-white px-6 py-3 rounded-lg">{t.save}</button>
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{t.basicInfo}</h3>
                    <button onClick={translateToEn} disabled={translating} className="px-4 py-2 bg-[#C9A96E] text-white rounded-lg text-sm hover:bg-[#B8985F] disabled:opacity-50">
                      {translating ? (lang === "cn" ? "翻译中..." : "Translating...") : (lang === "cn" ? "中→英 自动翻译" : "CN→EN Auto")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">{t.nameCn}</label><input value={newP.nameCn||""} onChange={e=>setNewP({...newP,nameCn:e.target.value})} className="w-full p-2 border rounded" placeholder={lang==="cn"?"中文名称":"Chinese name"} /></div>
                    <div><label className="text-sm text-gray-600">{t.name} (EN)</label><input value={newP.name||""} onChange={e=>setNewP({...newP,name:e.target.value})} className="w-full p-2 border rounded" placeholder="English name" /></div>
                    <div><label className="text-sm text-gray-600">{t.category}</label><select value={newP.category||"clothing"} onChange={e=>setNewP({...newP,category:e.target.value})} className="w-full p-2 border rounded"><option value="clothing">{categories.clothing}</option><option value="pants">{categories.pants}</option><option value="bags">{categories.bags}</option><option value="watches">{categories.watches}</option><option value="jewelry">{categories.jewelry}</option></select></div>
                    <div><label className="text-sm text-gray-600">{t.priceUnit}</label><input type="number" value={newP.price||""} onChange={e=>setNewP({...newP,price:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                  </div>
                  <div className="mb-4"><label className="text-sm text-gray-600">{t.descriptionCn}</label><textarea value={newP.descriptionCn||""} onChange={e=>setNewP({...newP,descriptionCn:e.target.value})} className="w-full p-2 border rounded h-20" placeholder={lang==="cn"?"中文描述":"Chinese description"} /></div>
                  <div><label className="text-sm text-gray-600">{t.description} (EN)</label><textarea value={newP.description||""} onChange={e=>setNewP({...newP,description:e.target.value})} className="w-full p-2 border rounded h-20" placeholder="English description" /></div>
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
                    <div><label className="text-sm text-gray-600">{t.colorTip || t.color}</label><select value={newSpec.color} onChange={e=>setNewSpec({...newSpec,color:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
{colorOptions.map((c,i)=><option key={c} value={lang==="cn"?COLORS_CN[i]:COLORS_EN[i]}>{c}</option>)}
</select></div>
                    <div><label className="text-sm text-gray-600">{t.sizeTip || t.size}</label><select value={newSpec.size} onChange={e=>setNewSpec({...newSpec,size:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
{sizeOptions.map(s=><option key={s} value={s}>{s}</option>)}
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
