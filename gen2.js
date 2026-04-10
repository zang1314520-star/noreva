const fs = require('fs');
let content = fs.readFileSync('app/admin/page.tsx', 'utf8');

const part2 = `
  if (loading) return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1A1A1A] text-white py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl">NOREVA Admin</h1>
          <div className="flex gap-6 text-sm">
            <button onClick={() => setTab("config")} className={tab === "config" ? "text-white" : "text-gray-400"}>Config</button>
            <button onClick={() => setTab("products")} className={tab === "products" ? "text-white" : "text-gray-400"}>Products ({products.length})</button>
            <a href="/" target="_blank" className="text-gray-400">Site</a>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-8">
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Products</h2>
              <button onClick={reset} className="px-4 py-2 border rounded-lg">+ New</button>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Basic</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">Name</label><input value={newP.name||''} onChange={e=>setNewP({...newP,name:e.target.value})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">Category</label><select value={newP.category||'clothing'} onChange={e=>setNewP({...newP,category:e.target.value})} className="w-full p-2 border rounded"><option value="clothing">Clothing</option><option value="pants">Pants</option><option value="bags">Bags</option><option value="watches">Watches</option><option value="jewelry">Jewelry</option></select></div>
                    <div><label className="text-sm text-gray-600">Price EUR</label><input type="number" value={newP.price||''} onChange={e=>setNewP({...newP,price:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                  </div>
                  <div><label className="text-sm text-gray-600">Description</label><textarea value={newP.description||''} onChange={e=>setNewP({...newP,description:e.target.value})} className="w-full p-2 border rounded h-20" /></div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Main Image</h3>
                  <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'main')} onClick={()=>document.getElementById('mainInput')?.click()} className="w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#C9A96E]">
                    {newP.mainImage ? <img src={newP.mainImage} alt="" className="h-36 object-contain" /> : <span className="text-gray-400">Drop or click</span>}
                  </div>
                  <input id="mainInput" type="file" accept="image/*" onChange={e=>handleUpload(e,'main')} className="hidden" />
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Spec Images (Color + Size)</h3>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div><label className="text-sm text-gray-600">Color</label><select value={newSpec.color} onChange={e=>setNewSpec({...newSpec,color:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
`;

for (const c of ["White","Black","Beige","Brown","Navy","Red","Pink","Green","Blue","Yellow","Gray","Gold","Silver"]) {
  part2 += `<option value="${c}">${c}</option>\n`;
}

part2 += `</select></div>
                    <div><label className="text-sm text-gray-600">Size</label><select value={newSpec.size} onChange={e=>setNewSpec({...newSpec,size:e.target.value})} className="w-full p-2 border rounded"><option value="">Select</option>
`;

for (const s of ["XS","S","M","L","XL","XXL"]) {
  part2 += `<option value="${s}">${s}</option>\n`;
}

part2 += `</select></div>
                    <div><label className="text-sm text-gray-600">Stock</label><input type="number" value={newSpec.stock} onChange={e=>setNewSpec({...newSpec,stock:Number(e.target.value)})} className="w-full p-2 border rounded" /></div>
                    <div><label className="text-sm text-gray-600">Image</label><div onClick={()=>document.getElementById('specInput')?.click()} className="p-2 border rounded cursor-pointer truncate">{newSpec.image ? 'Selected' : 'Select'}</div><input id="specInput" type="file" accept="image/*" onChange={e=>handleUpload(e,'spec')} className="hidden" /></div>
                  </div>
                  {newSpec.image && <img src={newSpec.image} alt="" className="w-16 h-16 object-cover mb-2 rounded" />}
                  <button onClick={addSpec} className="px-4 py-2 bg-[#1A1A1A] text-white rounded">Add Spec</button>
                  <div className="mt-4 space-y-2">
                    {(newP.specs||[]).map(s=>(
                      <div key={s.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <img src={s.image} alt="" className="w-12 h-12 object-cover rounded" />
                        <span className="font-medium">{s.color}</span>
                        <span className="text-gray-500">{s.size}</span>
                        <span className="text-sm text-gray-400">x{s.stock}</span>
                        <button onClick={()=>removeSpec(s.id)} className="ml-auto text-red-500">X</button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-medium mb-4">Detail Images</h3>
                  <div onDragOver={e=>e.preventDefault()} onDrop={e=>handleDrop(e,'detail')} onClick={()=>document.getElementById('detailInput')?.click()} className="w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#C9A96E]">
                    <span className="text-gray-400">Drop detail images</span>
                  </div>
                  <input id="detailInput" type