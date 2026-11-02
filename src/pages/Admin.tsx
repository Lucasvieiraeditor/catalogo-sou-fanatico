import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, Order, StoreConfig } from '../lib/types'
import { LayoutDashboard, Package, ShoppingCart, LogOut, Plus, Pencil, Trash2, TrendingUp, DollarSign, Archive, Calendar, Image } from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin/login')
    })
  }, [navigate])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 bg-card border-b border-border h-14 px-4 flex items-center justify-between">
        <h1 className="font-bold text-[17px] text-gold">Painel Admin</h1>
        <button onClick={handleLogout} className="text-muted hover:text-danger transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </header>
      <nav className="bg-card border-b border-border px-4 flex gap-1 overflow-x-auto no-scrollbar">
        {[
          { to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/produtos', icon: Package, label: 'Produtos' },
          { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
          { to: '/admin/banners', icon: Image, label: 'Banners' },
        ].map(({ to, end, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex items-center gap-1.5 px-3 py-3 text-[13px] font-medium border-b-2 transition-colors shrink-0 ${
              isActive ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-text'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="p-4 max-w-[800px] mx-auto">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<ProductsManager />} />
          <Route path="pedidos" element={<OrdersManager />} />
          <Route path="banners" element={<BannersManager />} />
        </Routes>
      </main>
    </div>
  )
}

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    supabase.from('orders').select('*').gte('created_at', firstDay)
      .then(({ data }) => { if (data) setOrders(data) })
    supabase.from('products').select('*')
      .then(({ data }) => { if (data) setProducts(data) })
  }, [])

  const monthlyRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0)
  const monthlyCost = orders.reduce((sum, o) => sum + (o.cost_price || 0), 0)
  const monthlyProfit = monthlyRevenue - monthlyCost
  const avgMargin = orders.length > 0 ? ((monthlyProfit / monthlyRevenue) * 100) : 0
  const totalStock = products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0)

  const cards = [
    { icon: DollarSign, label: 'Lucro do Mês', value: `R$ ${monthlyProfit.toFixed(2).replace('.', ',')}`, color: 'text-stock' },
    { icon: TrendingUp, label: 'Margem Média', value: `${avgMargin.toFixed(1)}%`, color: 'text-gold' },
    { icon: Archive, label: 'Estoque Total', value: `${totalStock} peças`, color: 'text-text' },
    { icon: Calendar, label: 'Pedidos no Mês', value: `${orders.length}`, color: 'text-order' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(c => (
        <div key={c.label} className="bg-card border border-border rounded-xl p-4">
          <c.icon className={`w-5 h-5 ${c.color} mb-2`} />
          <p className="text-[11px] text-muted uppercase tracking-wide">{c.label}</p>
          <p className={`font-bold text-[20px] ${c.color} mt-0.5`}>{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  async function save() {
    if (!editing) return
    setLoading(true)
    const payload = {
      team: editing.team || '',
      name: editing.name || '',
      season: editing.season || '2024/25',
      type: editing.type || 'Camisa',
      quality: editing.quality || 'Premium 1.1',
      material: editing.material || 'Poliéster',
      category: editing.category || 'Nacional',
      price: Number(editing.price) || 0,
      old_price: editing.old_price ? Number(editing.old_price) : null,
      cost_price: Number(editing.cost_price) || 0,
      image_url: editing.image_url || '',
      sizes: editing.sizes || ['P', 'M', 'G', 'GG'],
      in_stock: editing.in_stock ?? true,
      stock_quantity: Number(editing.stock_quantity) || 0,
      delivery_date: editing.delivery_date || null,
      is_new: editing.is_new ?? false,
      active: editing.active ?? true,
    }

    if (editing.id) {
      await supabase.from('products').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setEditing(null)
    setLoading(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Excluir este produto?')) return
    await supabase.from('products').delete().eq('id', id)
    load()
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <h2 className="font-bold text-[17px] text-text">{editing.id ? 'Editar' : 'Novo'} Produto</h2>
        {([
          ['team', 'Time', 'text'],
          ['name', 'Nome da Camisa', 'text'],
          ['season', 'Temporada', 'text'],
          ['type', 'Tipo (ex: Manto 1)', 'text'],
          ['quality', 'Qualidade', 'text'],
          ['material', 'Material', 'text'],
          ['price', 'Preço de Venda', 'number'],
          ['old_price', 'Preço Antigo (opcional)', 'number'],
          ['cost_price', 'Preço de Custo', 'number'],
          ['image_url', 'URL da Imagem', 'text'],
          ['stock_quantity', 'Qtd em Estoque', 'number'],
          ['delivery_date', 'Previsão de Entrega', 'date'],
        ] as const).map(([key, label, type]) => (
          <div key={key}>
            <label className="text-[12px] text-muted block mb-1">{label}</label>
            <input
              type={type}
              value={(editing as Record<string, unknown>)[key] as string ?? ''}
              onChange={e => setEditing({ ...editing, [key]: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-elevated border border-border text-text text-[14px] focus:outline-none focus:border-gold"
            />
          </div>
        ))}

        {/* Categoria */}
        <div>
          <label className="text-[12px] text-muted block mb-1">Categoria</label>
          <select
            value={editing.category || 'Nacional'}
            onChange={e => setEditing({ ...editing, category: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-elevated border border-border text-text text-[14px] focus:outline-none focus:border-gold"
          >
            <option value="Nacional">Nacional</option>
            <option value="Internacional">Internacional</option>
            <option value="Seleção">Seleção</option>
          </select>
        </div>

        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-[13px] text-text">
            <input type="checkbox" checked={editing.in_stock ?? true} onChange={e => setEditing({ ...editing, in_stock: e.target.checked })} className="accent-gold" />
            Em estoque
          </label>
          <label className="flex items-center gap-2 text-[13px] text-text">
            <input type="checkbox" checked={editing.is_new ?? false} onChange={e => setEditing({ ...editing, is_new: e.target.checked })} className="accent-gold" />
            Novo
          </label>
          <label className="flex items-center gap-2 text-[13px] text-text">
            <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="accent-gold" />
            Ativo
          </label>
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={loading}
            className="flex-1 h-10 bg-gold text-bg font-bold text-[14px] rounded-lg disabled:opacity-50">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button onClick={() => setEditing(null)}
            className="flex-1 h-10 bg-elevated text-text font-medium text-[14px] rounded-lg border border-border">
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-[17px] text-text">{products.length} Produtos</h2>
        <button onClick={() => setEditing({ sizes: ['P', 'M', 'G', 'GG'], in_stock: true, active: true, is_new: false, category: 'Nacional' })}
          className="h-9 px-4 bg-gold text-bg font-bold text-[13px] rounded-lg flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>
      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-3 flex gap-3 items-center">
            <img src={p.image_url || 'https://via.placeholder.com/56x56/242424/999999?text=C'} alt="" className="w-14 h-14 rounded-lg object-cover bg-elevated shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gold font-bold uppercase">{p.team} <span className="text-muted font-medium">• {p.category}</span></p>
              <p className="text-[14px] font-bold text-text truncate">{p.name}</p>
              <p className="text-[12px] text-muted">R$ {p.price} | Custo: R$ {p.cost_price}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setEditing(p)} className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-text hover:text-gold">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-text hover:text-danger">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOrders(data) })
  }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div>
      <h2 className="font-bold text-[17px] text-text mb-3">{orders.length} Pedidos</h2>
      {orders.length === 0 && <p className="text-[14px] text-muted">Nenhum pedido ainda.</p>}
      <div className="space-y-2">
        {orders.map(o => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-[14px] text-text">{o.product_name}</p>
                <p className="text-[12px] text-muted">Tam: {o.size} | {o.customer_name}</p>
                <p className="text-[12px] text-muted">{o.customer_phone}</p>
                <p className="text-[11px] text-muted mt-1">{new Date(o.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[15px] text-gold">R$ {o.price}</p>
                <p className="text-[11px] text-stock">Lucro: R$ {((o.price || 0) - (o.cost_price || 0)).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex gap-1.5 mt-2">
              {['pendente', 'confirmado', 'enviado', 'entregue'].map(s => (
                <button key={s} onClick={() => updateStatus(o.id, s)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    o.status === s ? 'bg-gold text-bg' : 'bg-elevated text-muted border border-border/50'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BannersManager() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('store_config').select('*').single()
      .then(({ data }) => { if (data) setConfig(data) })
  }, [])

  const banners = config?.banner_images || []

  async function addBanner() {
    if (!newUrl.trim()) return
    setLoading(true)
    const updated = [...banners, newUrl.trim()]
    await supabase.from('store_config').update({ banner_images: updated }).eq('id', 1)
    setConfig(config ? { ...config, banner_images: updated } : null)
    setNewUrl('')
    setLoading(false)
  }

  async function removeBanner(idx: number) {
    const updated = banners.filter((_, i) => i !== idx)
    await supabase.from('store_config').update({ banner_images: updated }).eq('id', 1)
    setConfig(config ? { ...config, banner_images: updated } : null)
  }

  return (
    <div>
      <h2 className="font-bold text-[17px] text-text mb-1">Banners do Catálogo</h2>
      <p className="text-[12px] text-muted mb-4">Fotos que aparecem atrás do perfil, passando automaticamente. Recomendado: 4 fotos.</p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          placeholder="Cole a URL da imagem..."
          className="flex-1 h-10 px-3 rounded-lg bg-elevated border border-border text-text text-[14px] focus:outline-none focus:border-gold"
        />
        <button onClick={addBanner} disabled={loading}
          className="h-10 px-4 bg-gold text-bg font-bold text-[13px] rounded-lg flex items-center gap-1.5 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {banners.length === 0 && <p className="text-[14px] text-muted">Nenhum banner. Adicione fotos acima.</p>}

      <div className="space-y-2">
        {banners.map((url, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-2 flex gap-3 items-center">
            <img src={url} alt="" className="w-20 h-12 rounded-lg object-cover bg-elevated shrink-0" />
            <p className="text-[12px] text-muted flex-1 min-w-0 truncate">{url}</p>
            <button onClick={() => removeBanner(i)} className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center text-text hover:text-danger shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
