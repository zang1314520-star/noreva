'use client'
import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Settings, Trash2, X, Plus, RefreshCw, ChevronDown, Image } from 'lucide-react'

const PASSWORD = 'noreva2026'

const CATS: Record<string, { name: string; nameCn: string }> = {
  bags: { name: 'Handbags', nameCn: '手提包' },
  belts: { name: 'Belts', nameCn: '皮带' },
  scarves: { name: 'Scarves', nameCn: '丝巾' },
  tops: { name: 'Tops', nameCn: '上装' },
  outerwear: { name: 'Outerwear', nameCn: '外套' },
  shoes: { name: 'Shoes', nameCn: '鞋履' },
  pants: { name: 'Pants', nameCn: '裤装' },
  dresses: { name: 'Dresses', nameCn: '裙装' },
  jewelry: { name: 'Jewelry', nameCn: '珠宝' },
  sunglasses: { name: 'Sunglasses', nameCn: '太阳镜' },
  handbags: { name: 'Handbags', nameCn: '手提包' },
  crossbody: { name: 'Crossbody', nameCn: '斜挎包' },
  backpacks: { name: 'Backpacks', nameCn: '双肩包' },
  wallets: { name: 'Wallets', nameCn: '钱包' },
}

const emptyProduct = () => ({
  id: 'prod_' + Date.now(),
  name: '', nameCn: '', brand: '',
  category: 'bags', categoryName: 'Handbags', categoryNameCn: '手提包',
  price: 0, currency: 'EUR',
  description: '', descriptionCn: '',
  mainImage: '',
  specs: [{ id: 's1', color: 'One Color', size: 'One Size', image: '', stock: 1 }],
  detailImages: [],
  featured: false,
  createdAt: new Date().toISOString().split('T')[0],
})

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'products' | 'orders' | 'settings'>('products')
  const [products, setProducts] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [orderFilter, setOrderFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (authed) {
      loadProducts()
      loadOrders()
      loadSettings()
    }
  }, [authed])

  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const loadProducts = async () => {
    try {
      const r = await fetch('/api/admin/data')
      const d = await r.json()
      setProducts(d.products || [])
    } catch { toast('加载产品失败') }
  }
  const loadOrders = async () => {
    setRefreshing(true)
    try {
      const r = await fetch('/api/orders' + (orderFilter ? `?status=${orderFilter}` : ''))
      const d = await r.json()
      setOrders(Array.isArray(d) ? d : [])
    } catch {}
    setRefreshing(false)
  }
  const loadSettings = async () => {
    try {
      const r = await fetch('/api/admin/settings')
      setSettings(await r.json())
    } catch {}
  }

  const login = () => { if (pw === PASSWORD) { setAuthed(true); setPw('') } else toast('密码错误') }

  const saveProduct = async () => {
    if (!editing) return
    const list = products.map(p => p.id === editing.id ? editing : p)
    if (!list.find(p => p.id === editing.id)) list.push(editing)
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: list }),
      })
      setProducts(list)
      setEditing(null)
      toast('保存成功!')
    } catch { toast('保存失败') }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('确定删除?')) return
    const list = products.filter(p => p.id !== id)
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: list }),
      })
      setProducts(list)
      toast('已删除')
    } catch { toast('删除失败') }
  }

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      loadOrders()
      setSelectedOrder(null)
      toast('状态已更新')
    } catch { toast('更新失败') }
  }

  const saveSettings = async () => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      toast('设置已保存')
    } catch { toast('保存失败') }
  }

  // Login
  if (!authed) return (
    <div className="min-h-screen bg-[#F5F4F2] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full">
        <h1 className="text-2xl font-serif text-center mb-6">NOREVA Admin</h1>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
          placeholder="密码" className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
        <button onClick={login} className="w-full bg-[#C9A96E] text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">登录</button>
        {msg && <p className="text-red-500 text-sm text-center mt-3">{msg}</p>}
      </div>
    </div>
  )

  // Dashboard
  return (
    <div className="min-h-screen bg-[#F5F4F2] font-sans text-[#1A1A1A]">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-serif font-bold">NOREVA Admin</h1>
          <nav className="flex gap-1">
            {[
              { key: 'products' as const, icon: Package, label: '产品' },
              { key: 'orders' as const, icon: ShoppingBag, label: '订单' },
              { key: 'settings' as const, icon: Settings, label: '设置' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-[#C9A96E] text-white' : 'hover:bg-gray-100'}`}>
                <t.icon className="w-4 h-4" />{t.label}
              </button>
            ))}
          </nav>
        </div>
        {msg && <span className="text-sm text-[#C9A96E] bg-[#C9A96E]/10 px-3 py-1 rounded-full">{msg}</span>}
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* ===== PRODUCTS TAB ===== */}
        {tab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">产品管理 · {products.length} 件</h2>
              <button onClick={() => setEditing(emptyProduct())}
                className="flex items-center gap-2 bg-[#C9A96E] text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
                <Plus className="w-4 h-4" />添加产品
              </button>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p.id} onClick={() => setEditing({...p})}
                  className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-[#C9A96E]/30">
                  <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {p.mainImage ? <img src={p.mainImage} alt="" className="w-full h-full object-cover" />
                      : <Image className="w-8 h-8 text-gray-300" />}
                  </div>
                  <p className="text-xs text-[#C9A96E] font-medium">{p.brand || '—'}</p>
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-sm">€{p.price?.toFixed(0) || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ORDERS TAB ===== */}
        {tab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">📋 订单管理</h2>
              <div className="flex gap-2">
                <select value={orderFilter} onChange={e => { setOrderFilter(e.target.value); setTimeout(loadOrders, 0) }}
                  className="border px-3 py-2 rounded-lg text-sm">
                  <option value="">全部</option>
                  <option value="pending">待处理</option>
                  <option value="paid">已付款</option>
                  <option value="shipped">已发货</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
                <button onClick={loadOrders} className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />刷新
                </button>
              </div>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">暂无订单 · 当客户通过 Stripe 支付后，订单会自动出现在这里</div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3">订单号</th>
                      <th className="px-4 py-3">客户</th>
                      <th className="px-4 py-3">金额</th>
                      <th className="px-4 py-3">状态</th>
                      <th className="px-4 py-3">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.id} onClick={() => setSelectedOrder(o)}
                        className="border-t hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-mono">#{o.id}</td>
                        <td className="px-4 py-3">{o.customer_name || o.customer_email || '—'}</td>
                        <td className="px-4 py-3">€{o.total?.toFixed(0)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-blue-100 text-blue-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{o.created_at?.split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {tab === 'settings' && settings && (
          <div className="max-w-lg">
            <h2 className="text-xl font-serif mb-6">⚙ 网站设置</h2>
            <div className="bg-white rounded-xl p-6 space-y-4">
              {[
                { key: 'siteName', label: '网站名称' },
                { key: 'email', label: '联系邮箱' },
                { key: 'phone', label: 'WhatsApp 号码' },
                { key: 'heroTitle', label: '首页标题' },
                { key: 'heroTitleCn', label: '首页标题(中文)' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 block mb-1">{label}</label>
                  <input value={settings[key] || ''} onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 block mb-1">统计代码（Google Analytics）</label>
                <textarea value={settings.trackingCode || ''} onChange={e => setSettings({ ...settings, trackingCode: e.target.value })}
                  rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
              </div>
              <button onClick={saveSettings} className="bg-[#C9A96E] text-white px-6 py-2 rounded-lg text-sm hover:bg-amber-700">保存设置</button>
            </div>
          </div>
        )}
      </main>

      {/* ===== EDIT MODAL ===== */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold">{editing.id && products.find(p => p.id === editing.id) ? '编辑产品' : '新建产品'}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <input placeholder="品牌" value={editing.brand} onChange={e => setEditing({...editing, brand: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg" />
              <input placeholder="产品名称" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg" />
              <input placeholder="中文名 (可选)" value={editing.nameCn || ''} onChange={e => setEditing({...editing, nameCn: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg" />
              <div className="flex gap-2">
                <select value={editing.category} onChange={e => {
                  const c = CATS[e.target.value]
                  setEditing({...editing, category: e.target.value, categoryName: c.name, categoryNameCn: c.nameCn})
                }} className="flex-1 px-3 py-2 border rounded-lg">
                  {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.nameCn}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input type="number" placeholder="价格" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})}
                  className="flex-1 px-3 py-2 border rounded-lg" />
                <select value={editing.currency} onChange={e => setEditing({...editing, currency: e.target.value})}
                  className="px-3 py-2 border rounded-lg">
                  <option value="EUR">EUR €</option>
                  <option value="CNY">CNY ¥</option>
                </select>
              </div>
              <input placeholder="主图 URL" value={editing.mainImage} onChange={e => setEditing({...editing, mainImage: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg" />
              {editing.mainImage && <img src={editing.mainImage} alt="" className="h-32 object-contain rounded" />}
              <textarea placeholder="描述" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})}
                rows={2} className="w-full px-3 py-2 border rounded-lg" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured}
                  onChange={e => setEditing({...editing, featured: e.target.checked})} />
                首页精选
              </label>

              {/* Specs */}
              <div className="border-t pt-3">
                <p className="font-medium mb-2">规格</p>
                {(editing.specs || []).map((s: any, i: number) => (
                  <div key={i} className="flex gap-1 mb-2 items-center">
                    <input placeholder="颜色" value={s.color} onChange={e => {
                      const sp = [...editing.specs]; sp[i].color = e.target.value; setEditing({...editing, specs: sp})
                    }} className="flex-1 px-2 py-1 border rounded text-xs" />
                    <input placeholder="尺码" value={s.size} onChange={e => {
                      const sp = [...editing.specs]; sp[i].size = e.target.value; setEditing({...editing, specs: sp})
                    }} className="w-20 px-2 py-1 border rounded text-xs" />
                    <input type="number" placeholder="库存" value={s.stock} onChange={e => {
                      const sp = [...editing.specs]; sp[i].stock = Number(e.target.value); setEditing({...editing, specs: sp})
                    }} className="w-16 px-2 py-1 border rounded text-xs" />
                    <button onClick={() => { const sp = editing.specs.filter((_:any,j:number) => j !== i); setEditing({...editing, specs: sp}) }}
                      className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
                <button onClick={() => setEditing({...editing, specs: [...(editing.specs || []), { id: 's'+Date.now(), color: '', size: '', image: '', stock: 1 }]})}
                  className="text-xs text-[#C9A96E] mt-1">+ 添加规格</button>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={saveProduct} className="flex-1 bg-[#C9A96E] text-white py-2 rounded-lg hover:bg-amber-700">保存</button>
              {products.find(p => p.id === editing.id) && (
                <button onClick={() => { deleteProduct(editing.id); setEditing(null) }}
                  className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== ORDER DETAIL MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif">订单 #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>客户:</strong> {selectedOrder.customer_name || '—'}</p>
              <p><strong>邮箱:</strong> {selectedOrder.customer_email || '—'}</p>
              <p><strong>金额:</strong> €{selectedOrder.total?.toFixed(0)}</p>
              <p><strong>状态:</strong> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedOrder.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedOrder.status}</span></p>
              <p><strong>时间:</strong> {selectedOrder.created_at}</p>
            </div>
            <div className="flex gap-2 mt-6">
              {['paid', 'shipped', 'completed', 'cancelled'].map(s => (
                <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)} disabled={selectedOrder.status === s}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${selectedOrder.status === s ? 'bg-gray-200 text-gray-400' : 'bg-[#C9A96E] text-white hover:bg-amber-700'}`}>
                  {s === 'paid' ? '已付' : s === 'shipped' ? '发货' : s === 'completed' ? '完成' : '取消'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
