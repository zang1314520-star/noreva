'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, X, Settings, Mail, Share2, Package, ChevronDown, RefreshCw } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'

const P = 'noreva2026'
const RATE = 7.8

export default function Admin() {
  const [a, sa] = useState(false)
  const [pa, spa] = useState('')
  const [pr, spr] = useState<any[]>([])
  const [e, se] = useState<any>(null)
  const [m, sm] = useState('')
  const [c, sc] = useState(false)
  const [tab, setTab] = useState<'products' | 'settings' | 'orders'>('products')
  const [st, setSt] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [orderFilter, setOrderFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { if (a) { l(); sL(); loadOrders() } }, [a])

  const l = async () => {
    const r = await fetch('/api/admin/data')
    const d = await r.json()
    spr(d.products || [])
  }
  const sL = async () => {
    const r = await fetch('/api/admin/settings')
    const d = await r.json()
    setSt(d)
  }
  const loadOrders = async () => {
    setRefreshing(true)
    try {
      const params = orderFilter ? `?status=${orderFilter}` : ''
      const r = await fetch('/api/orders' + params)
      const d = await r.json()
      setOrders(Array.isArray(d) ? d : [])
    } catch {}
    setRefreshing(false)
  }
  const login = () => { if (pa === P) { sa(true); spa('') } else sm('密码错误') }
  const save = async (np: any[]) => {
    sm('保存中...')
    try {
      await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ products: np }) })
      spr(np); sm('保存成功!'); se(null)
    } catch { sm('失败') }
    setTimeout(() => sm(''), 3000)
  }
  const saveSettings = async () => {
    sm('保存中...')
    try {
      await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(st) })
      sm('保存成功!')
    } catch { sm('失败') }
    setTimeout(() => sm(''), 3000)
  }
  const updateOrderStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
      loadOrders()
      setSelectedOrder(null)
      sm('订单状态已更新')
      setTimeout(() => sm(''), 3000)
    } catch { sm('更新失败') }
  }
  const fmt = (p: any) => {
    try {
      const n = parseFloat(p.price.replace(/[^0-9.]/g, ''))
      if (p.price.includes('¥')) return c ? p.price : '€' + (n / RATE).toFixed(0)
      return c ? '¥' + (n * RATE).toFixed(0) : p.price
    } catch { return p.price }
  }

  // --- LOGIN SCREEN ---
  if (!a) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">🏪 NOREVA 管理后台</h1>
        <p className="text-gray-500 mb-4">请输入密码登录</p>
        <input type="password" value={pa} onChange={ev => spa(ev.target.value)}
          onKeyPress={ev => ev.key === 'Enter' && login()}
          className="w-full px-4 py-3 border rounded-lg mb-4" placeholder="密码" />
        <button onClick={login} className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-amber-600">登 录</button>
        {m && <p className="text-red-500 mt-4">{m}</p>}
        <p className="text-gray-400 text-sm mt-4">默认密码: noreva2026</p>
      </div>
    </div>
  )

  // --- MAIN ADMIN ---
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold">NOREVA</a>
          <span className="text-gray-400">管理后台</span>
          <div className="flex gap-3 items-center">
            <button onClick={() => sc(false)} className={`px-3 py-1 rounded text-sm ${!c ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>€ EUR</button>
            <button onClick={() => sc(true)} className={`px-3 py-1 rounded text-sm ${c ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>¥ CNY</button>
            <a href="/" className="text-sm text-gray-500">网站</a>
            <button onClick={() => sa(false)} className="text-red-500">退出</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-4 border-b">
          <button onClick={() => setTab('products')}
            className={`pb-2 px-4 font-medium ${tab === 'products' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-gray-500'}`}>
            📦 产品管理
          </button>
          <button onClick={() => { setTab('orders'); loadOrders() }}
            className={`pb-2 px-4 font-medium ${tab === 'orders' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-gray-500'}`}>
            📋 订单管理
          </button>
          <button onClick={() => setTab('settings')}
            className={`pb-2 px-4 font-medium ${tab === 'settings' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-gray-500'}`}>
            ⚙️ 网站设置
          </button>
        </div>
      </div>

      {/* Message */}
      {m && (
        <div className="container mx-auto px-4">
          <div className={`p-4 rounded-lg mb-4 ${m.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {m}
          </div>
        </div>
      )}

      {/* === PRODUCTS TAB === */}
      {tab === 'products' && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">产品管理 ({pr.length}个)</h2>
            <button onClick={() => se({ id: Date.now().toString(), name: '', price: '', category: 'clothing', image: '', tag: '' })}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg">+ 添加产品</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pr.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500">还没有产品，点击添加</div>
            ) : pr.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100">
                  {p.image ? <img src={p.image} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{p.name || '未命名'}</h3>
                  <p className="text-amber-600 font-bold">{fmt(p)}</p>
                  {p.tag && <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded mt-1">{p.tag}</span>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => se({ ...p })} className="flex-1 bg-gray-100 py-2 rounded text-sm">编辑</button>
                    <button onClick={() => { if (confirm('确定删除?')) save(pr.filter(x => x.id !== p.id)) }}
                      className="bg-red-50 text-red-600 px-3 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === ORDERS TAB === */}
      {tab === 'orders' && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-bold">订单管理 ({orders.length})</h2>
            <div className="flex gap-3">
              <select
                value={orderFilter}
                onChange={e => { setOrderFilter(e.target.value); setTimeout(loadOrders, 0) }}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="paid">已付款</option>
                <option value="processing">处理中</option>
                <option value="shipped">已发货</option>
                <option value="delivered">已交付</option>
                <option value="cancelled">已取消</option>
              </select>
              <button onClick={loadOrders} className="px-3 py-2 border rounded-lg flex items-center gap-1 text-sm">
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> 刷新
              </button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>暂无订单</p>
              <p className="text-sm mt-2">客户完成支付后订单会自动出现</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-sm text-gray-500">
                  <tr>
                    <th className="p-4">订单号</th>
                    <th className="p-4">客户</th>
                    <th className="p-4">金额</th>
                    <th className="p-4">状态</th>
                    <th className="p-4">时间</th>
                    <th className="p-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{order.order_number}</td>
                      <td className="p-4">{order.customer_email || order.customer_name || '-'}</td>
                      <td className="p-4 font-bold">{(order.currency || 'eur').toUpperCase()} {(Number(order.total) || 0).toFixed(0)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'paid' ? '已付款' :
                           order.status === 'pending' ? '待处理' :
                           order.status === 'processing' ? '处理中' :
                           order.status === 'shipped' ? '已发货' :
                           order.status === 'delivered' ? '已交付' :
                           order.status === 'cancelled' ? '已取消' : order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-amber-600 hover:underline text-sm"
                        >
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold">订单详情</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400"><X className="w-6 h-6" /></button>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong>订单号：</strong>{selectedOrder.order_number}</p>
                  <p><strong>客户：</strong>{selectedOrder.customer_name || '-'} ({selectedOrder.customer_email || '-'})</p>
                  <p><strong>金额：</strong>{(selectedOrder.currency || 'EUR').toUpperCase()} {Number(selectedOrder.total || 0).toFixed(0)}</p>
                  <p><strong>状态：</strong>{selectedOrder.status}</p>
                  <p><strong>时间：</strong>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('zh-CN') : '-'}</p>
                  {selectedOrder.shipping_address && (
                    <p><strong>地址：</strong>{JSON.stringify(selectedOrder.shipping_address)}</p>
                  )}
                  {selectedOrder.notes && (
                    <p><strong>备注：</strong>{selectedOrder.notes}</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">更新状态</p>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        disabled={selectedOrder.status === s}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                          selectedOrder.status === s
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {s === 'pending' ? '待处理' : s === 'paid' ? '已付款' : s === 'processing' ? '处理中' :
                         s === 'shipped' ? '已发货' : s === 'delivered' ? '已交付' : '已取消'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === SETTINGS TAB === */}
      {tab === 'settings' && (
        <div className="container mx-auto px-4 py-8">
          {st && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Mail className="w-5 h-5" />联系方式</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm text-gray-600 mb-1">邮箱</label>
                    <input value={st.contact.email} onChange={ev => setSt({ ...st, contact: { ...st.contact, email: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">WhatsApp</label>
                    <input value={st.contact.whatsapp} onChange={ev => setSt({ ...st, contact: { ...st.contact, whatsapp: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">地址</label>
                    <input value={st.contact.address} onChange={ev => setSt({ ...st, contact: { ...st.contact, address: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Share2 className="w-5 h-5" />社交媒体</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm text-gray-600 mb-1">Instagram</label>
                    <input value={st.social.instagram} onChange={ev => setSt({ ...st, social: { ...st.social, instagram: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">Facebook</label>
                    <input value={st.social.facebook} onChange={ev => setSt({ ...st, social: { ...st.social, facebook: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">Twitter/X</label>
                    <input value={st.social.twitter} onChange={ev => setSt({ ...st, social: { ...st.social, twitter: ev.target.value } })}
                      className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
              </div>
            </div>
          )}
          <button onClick={saveSettings} className="mt-6 bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700">保存设置</button>
        </div>
      )}

      {/* === PRODUCT EDIT MODAL === */}
      {e && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{pr.find(x => x.id === e.id) ? '编辑' : '添加'}产品</h3>
            <button onClick={() => se(null)} className="float-right text-gray-400"><X className="w-6 h-6" /></button>
            <div className="space-y-4 clear-both">
              <div><label className="block text-sm mb-1">产品名称 *</label>
                <input value={e.name} onChange={t => se({ ...e, name: t.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm mb-1">价格 * (€或¥开头)</label>
                <input value={e.price} onChange={t => se({ ...e, price: t.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="€890 或 ¥5000" /></div>
              <div><label className="block text-sm mb-1">分类</label>
                <select value={e.category} onChange={t => se({ ...e, category: t.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="clothing">服装</option>
                  <option value="bags">包包</option>
                  <option value="watches">手表</option>
                  <option value="jewelry">首饰</option>
                  <option value="shoes">鞋子</option>
                </select></div>
              <div><label className="block text-sm mb-1">标签</label>
                <input value={e.tag || ''} onChange={t => se({ ...e, tag: t.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="New / Sale" /></div>
              <div><label className="block text-sm mb-2">产品图片</label>
                <ImageUpload value={e.image} onChange={img => se({ ...e, image: img })} /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => se(null)} className="flex-1 py-2 border rounded-lg">取消</button>
              <button onClick={() => {
                if (!e.name || !e.price) return sm('填写名称和价格')
                const np = pr.find(x => x.id === e.id) ? pr.map(x => x.id === e.id ? e : x) : [...pr, e]
                save(np)
              }} className="flex-1 bg-amber-600 text-white py-2 rounded-lg">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
