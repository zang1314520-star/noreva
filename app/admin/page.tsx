"use client";

import { useEffect, useState } from "react";
import { Image, Package, Plus, RefreshCw, Settings, ShoppingBag, Trash2, Truck, X } from "lucide-react";

const CATS: Record<string, { name: string; nameCn: string }> = {
  backpacks: { name: "Backpacks", nameCn: "双肩背包" },
  commuter: { name: "Commuter Backpacks", nameCn: "通勤背包" },
  business: { name: "Business Backpacks", nameCn: "商务背包" },
  travel: { name: "Travel Backpacks", nameCn: "旅行背包" },
};

const STATUS_OPTIONS = [
  { value: "paid", label: "已付款" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const FULFILLMENT_OPTIONS = [
  { value: "unfulfilled", label: "待发货" },
  { value: "shipped", label: "运输中" },
  { value: "delivered", label: "已签收" },
];

const emptyProduct = () => ({
  id: `prod_${Date.now()}`,
  name: "",
  nameCn: "",
  brand: "Nayo Smart",
  category: "backpacks",
  categoryName: "Backpacks",
  categoryNameCn: "双肩背包",
  price: 0,
  currency: "USD",
  description: "",
  descriptionCn: "",
  mainImage: "",
  specs: [{ id: "s1", color: "One Color", size: "One Size", image: "", stock: 1 }],
  detailImages: [],
  featured: false,
  createdAt: new Date().toISOString().split("T")[0],
});

function money(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function statusLabel(status?: string) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status || "-";
}

function fulfillmentLabel(status?: string) {
  return FULFILLMENT_OPTIONS.find((item) => item.value === status)?.label || status || "待发货";
}

function parseShippingAddress(value: any) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function shippingAddressLines(value: any) {
  const address = parseShippingAddress(value);
  if (!address) return [];

  return [
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"products" | "orders" | "settings">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDraft, setOrderDraft] = useState<any>({});
  const [settings, setSettings] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (authed) {
      loadProducts();
      loadOrders();
      loadSettings();
    }
  }, [authed]);

  const toast = (message: string) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 3000);
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/data");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      toast("产品加载失败");
    }
  };

  const loadOrders = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/orders${orderFilter ? `?status=${orderFilter}` : ""}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast("订单加载失败");
    } finally {
      setRefreshing(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      setSettings(await res.json());
    } catch {
      toast("设置加载失败");
    }
  };

  const login = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });

      if (!res.ok) {
        toast("密码错误");
        return;
      }

      setAuthed(true);
      setPw("");
    } catch {
      toast("登录失败，请稍后再试");
    }
  };

  const saveProduct = async () => {
    if (!editing) return;
    const nextProducts = products.map((product) => (product.id === editing.id ? editing : product));
    if (!nextProducts.find((product) => product.id === editing.id)) nextProducts.push(editing);

    try {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: nextProducts }),
      });
      setProducts(nextProducts);
      setEditing(null);
      toast("产品已保存");
    } catch {
      toast("保存失败");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("确定删除这个产品？")) return;
    const nextProducts = products.filter((product) => product.id !== id);

    try {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: nextProducts }),
      });
      setProducts(nextProducts);
      setEditing(null);
      toast("产品已删除");
    } catch {
      toast("删除失败");
    }
  };

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDraft({
      status: order.status || "paid",
      fulfillment_status: order.fulfillment_status || "unfulfilled",
      tracking_carrier: order.tracking_carrier || "",
      tracking_number: order.tracking_number || "",
      tracking_url: order.tracking_url || "",
      admin_note: order.admin_note || "",
    });
  };

  const saveOrder = async (patch: any = {}) => {
    if (!selectedOrder) return;
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedOrder.id, ...orderDraft, ...patch }),
      });
      await loadOrders();
      setSelectedOrder(null);
      toast("订单已更新");
    } catch {
      toast("订单更新失败");
    }
  };

  const saveSettings = async () => {
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast("设置已保存");
    } catch {
      toast("设置保存失败");
    }
  };

  const selectedItems = Array.isArray(selectedOrder?.items) ? selectedOrder.items : [];
  const selectedAddressLines = selectedOrder ? shippingAddressLines(selectedOrder.shipping_address) : [];

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F5F4F2] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full">
          <h1 className="text-2xl font-serif text-center mb-6">Nayo Smart Admin</h1>
          <input
            type="password"
            value={pw}
            onChange={(event) => setPw(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && login()}
            placeholder="密码"
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
          />
          <button onClick={login} className="w-full bg-[#C9A96E] text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
            登录
          </button>
          {msg && <p className="text-red-500 text-sm text-center mt-3">{msg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F4F2] font-sans text-[#1A1A1A]">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-serif font-bold">Nayo Smart Admin</h1>
          <nav className="flex gap-1">
            {[
              { key: "products" as const, icon: Package, label: "产品" },
              { key: "orders" as const, icon: ShoppingBag, label: "订单" },
              { key: "settings" as const, icon: Settings, label: "设置" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === item.key ? "bg-[#C9A96E] text-white" : "hover:bg-gray-100"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        {msg && <span className="text-sm text-[#C9A96E] bg-[#C9A96E]/10 px-3 py-1 rounded-full">{msg}</span>}
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">产品管理 · {products.length} 款</h2>
              <button onClick={() => setEditing(emptyProduct())} className="flex items-center gap-2 bg-[#C9A96E] text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700">
                <Plus className="w-4 h-4" />
                添加产品
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setEditing({ ...product })}
                  className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-[#C9A96E]/30"
                >
                  <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.mainImage ? <img src={product.mainImage} alt="" className="w-full h-full object-cover" /> : <Image className="w-8 h-8 text-gray-300" />}
                  </div>
                  <p className="text-xs text-[#C9A96E] font-medium">{product.brand || "Nayo Smart"}</p>
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-sm">{money(product.price, product.currency || "USD")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">订单与物流</h2>
              <div className="flex gap-2">
                <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)} className="border px-3 py-2 rounded-lg text-sm">
                  <option value="">全部订单</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <button onClick={loadOrders} className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  刷新
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-400">暂无订单。Stripe 支付成功后订单会自动出现在这里。</div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-4 py-3">订单号</th>
                      <th className="px-4 py-3">客户</th>
                      <th className="px-4 py-3">金额</th>
                      <th className="px-4 py-3">订单状态</th>
                      <th className="px-4 py-3">物流</th>
                      <th className="px-4 py-3">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} onClick={() => openOrder(order)} className="border-t hover:bg-gray-50 cursor-pointer">
                        <td className="px-4 py-3 font-mono">{order.order_number || `#${order.id}`}</td>
                        <td className="px-4 py-3">{order.customer_name || order.customer_email || "-"}</td>
                        <td className="px-4 py-3">{money(order.total, order.currency || "USD")}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${order.status === "paid" ? "bg-green-100 text-green-700" : order.status === "shipped" ? "bg-blue-100 text-blue-700" : order.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {order.tracking_number ? (
                            <span className="inline-flex items-center gap-1 text-blue-700">
                              <Truck className="w-3 h-3" />
                              {order.tracking_carrier || "Tracking"} · {order.tracking_number}
                            </span>
                          ) : (
                            <span className="text-gray-400">待录入</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{order.created_at?.split("T")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "settings" && settings && (
          <div className="max-w-lg">
            <h2 className="text-xl font-serif mb-6">网站设置</h2>
            <div className="bg-white rounded-xl p-6 space-y-4">
              {[
                { key: "siteName", label: "网站名称" },
                { key: "email", label: "联系邮箱" },
                { key: "phone", label: "WhatsApp 号码" },
                { key: "heroTitle", label: "首页标题" },
                { key: "heroTitleCn", label: "首页标题（中文）" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 block mb-1">{label}</label>
                  <input value={settings[key] || ""} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 block mb-1">统计代码</label>
                <textarea value={settings.trackingCode || ""} onChange={(event) => setSettings({ ...settings, trackingCode: event.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
              </div>
              <button onClick={saveSettings} className="bg-[#C9A96E] text-white px-6 py-2 rounded-lg text-sm hover:bg-amber-700">保存设置</button>
            </div>
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-10 overflow-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif font-bold">{products.find((product) => product.id === editing.id) ? "编辑产品" : "新建产品"}</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <input placeholder="品牌" value={editing.brand} onChange={(event) => setEditing({ ...editing, brand: event.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input placeholder="产品名称" value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input placeholder="中文名称" value={editing.nameCn || ""} onChange={(event) => setEditing({ ...editing, nameCn: event.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <select
                value={editing.category}
                onChange={(event) => {
                  const category = CATS[event.target.value];
                  setEditing({ ...editing, category: event.target.value, categoryName: category.name, categoryNameCn: category.nameCn });
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.entries(CATS).map(([key, value]) => <option key={key} value={key}>{value.nameCn}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="number" placeholder="价格" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} className="flex-1 px-3 py-2 border rounded-lg" />
                <select value={editing.currency} onChange={(event) => setEditing({ ...editing, currency: event.target.value })} className="px-3 py-2 border rounded-lg">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
              <input placeholder="主图 URL" value={editing.mainImage} onChange={(event) => setEditing({ ...editing, mainImage: event.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              {editing.mainImage && <img src={editing.mainImage} alt="" className="h-32 object-contain rounded" />}
              <textarea placeholder="英文描述" value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
              <textarea placeholder="中文描述" value={editing.descriptionCn || ""} onChange={(event) => setEditing({ ...editing, descriptionCn: event.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(editing.featured)} onChange={(event) => setEditing({ ...editing, featured: event.target.checked })} />
                首页推荐
              </label>

              <div className="border-t pt-3">
                <p className="font-medium mb-2">规格</p>
                {(editing.specs || []).map((spec: any, index: number) => (
                  <div key={spec.id || index} className="flex gap-1 mb-2 items-center">
                    <input placeholder="颜色" value={spec.color} onChange={(event) => {
                      const specs = [...editing.specs];
                      specs[index].color = event.target.value;
                      setEditing({ ...editing, specs });
                    }} className="flex-1 px-2 py-1 border rounded text-xs" />
                    <input placeholder="尺寸" value={spec.size} onChange={(event) => {
                      const specs = [...editing.specs];
                      specs[index].size = event.target.value;
                      setEditing({ ...editing, specs });
                    }} className="w-20 px-2 py-1 border rounded text-xs" />
                    <input type="number" placeholder="库存" value={spec.stock} onChange={(event) => {
                      const specs = [...editing.specs];
                      specs[index].stock = Number(event.target.value);
                      setEditing({ ...editing, specs });
                    }} className="w-16 px-2 py-1 border rounded text-xs" />
                    <button onClick={() => setEditing({ ...editing, specs: editing.specs.filter((_: any, itemIndex: number) => itemIndex !== index) })} className="p-1 text-red-400 hover:bg-red-50 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button onClick={() => setEditing({ ...editing, specs: [...(editing.specs || []), { id: `s${Date.now()}`, color: "", size: "", image: "", stock: 1 }] })} className="text-xs text-[#C9A96E] mt-1">
                  + 添加规格
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={saveProduct} className="flex-1 bg-[#C9A96E] text-white py-2 rounded-lg hover:bg-amber-700">保存</button>
              {products.find((product) => product.id === editing.id) && (
                <button onClick={() => deleteProduct(editing.id)} className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-serif">订单 {selectedOrder.order_number || `#${selectedOrder.id}`}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><strong>客户：</strong>{selectedOrder.customer_name || "-"}</p>
              <p><strong>邮箱：</strong>{selectedOrder.customer_email || "-"}</p>
              <p><strong>电话：</strong>{selectedOrder.customer_phone || "-"}</p>
              <p><strong>金额：</strong>{money(selectedOrder.total, selectedOrder.currency || "USD")}</p>
              <p><strong>付款：</strong>{selectedOrder.payment_status || "paid"}</p>
              <p><strong>下单：</strong>{selectedOrder.created_at?.replace("T", " ").slice(0, 16)}</p>
              <p><strong>物流：</strong>{fulfillmentLabel(orderDraft.fulfillment_status)}</p>
            </div>

            <div className="mt-5 grid gap-4 rounded-xl bg-gray-50 p-4 text-sm md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">收件信息</p>
                <p className="font-medium">{selectedOrder.shipping_name || selectedOrder.customer_name || "-"}</p>
                {selectedAddressLines.length > 0 ? (
                  <div className="mt-2 space-y-1 text-gray-600">
                    {selectedAddressLines.map((line: string) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-400">暂无收件地址</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">商品明细</p>
                {selectedItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItems.map((item: any, index: number) => (
                      <div key={`${item.product_id || item.product_name || "item"}-${index}`} className="flex items-center gap-3">
                        {item.product_image ? <img src={item.product_image} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-white" />}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{item.product_name || "Nayo Smart backpack"}</p>
                          <p className="text-xs text-gray-500">x{item.quantity || 1} · {money(item.price, selectedOrder.currency || "USD")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">暂无商品明细</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">订单状态</label>
                <select value={orderDraft.status} onChange={(event) => setOrderDraft({ ...orderDraft, status: event.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">履约状态</label>
                <select value={orderDraft.fulfillment_status} onChange={(event) => setOrderDraft({ ...orderDraft, fulfillment_status: event.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {FULFILLMENT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">物流公司</label>
                <input value={orderDraft.tracking_carrier} onChange={(event) => setOrderDraft({ ...orderDraft, tracking_carrier: event.target.value })} placeholder="DHL / FedEx / UPS / YunExpress" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">物流单号</label>
                <input value={orderDraft.tracking_number} onChange={(event) => setOrderDraft({ ...orderDraft, tracking_number: event.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">物流查询链接（可选）</label>
                <input value={orderDraft.tracking_url} onChange={(event) => setOrderDraft({ ...orderDraft, tracking_url: event.target.value })} placeholder="不填则自动生成 17TRACK 或承运商链接" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 block mb-1">内部备注</label>
                <textarea value={orderDraft.admin_note} onChange={(event) => setOrderDraft({ ...orderDraft, admin_note: event.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => saveOrder()} className="flex-1 bg-[#C9A96E] text-white py-2 rounded-lg hover:bg-amber-700">保存订单</button>
              <button onClick={() => saveOrder({ status: "shipped", fulfillment_status: "shipped" })} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">标记发货</button>
              <button onClick={() => saveOrder({ status: "completed", fulfillment_status: "delivered" })} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">标记完成</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
