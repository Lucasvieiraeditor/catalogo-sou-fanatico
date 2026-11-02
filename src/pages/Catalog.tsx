import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, StoreConfig } from '../lib/types'
import { Search, ShieldCheck, Star, Check, Clock } from 'lucide-react'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [showCatalog, setShowCatalog] = useState(false)

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProducts(data) })
    supabase.from('store_config').select('*').single()
      .then(({ data }) => { if (data) setConfig(data) })
  }, [])

  const teams = ['Todos', ...new Set(products.map(p => p.team))]

  const filtered = products.filter(p => {
    if (filter !== 'Todos' && p.team !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.team.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const whatsappUrl = config ? `https://wa.me/${config.whatsapp}` : '#'

  if (!showCatalog) {
    return (
      <div className="min-h-screen bg-bg flex justify-center">
        <div className="w-full max-w-[390px] min-h-screen bg-bg flex flex-col relative">
          <main className="flex-1 pb-20">
            {/* Capa */}
            <section className="relative">
              <div className="h-[220px] w-full bg-card relative flex flex-col items-center justify-center overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(circle at center, #242424 0%, #1A1A1A 100%)',
                }}>
                <div className="absolute top-0 left-0 w-24 h-24 opacity-40">
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    {[16,32,48,64,80].map(y => <line key={y} x1="0" y1={y} x2={y} y2="0" stroke="#2A2A2A" strokeWidth="1.5"/>)}
                  </svg>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 opacity-40">
                  <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                    {[16,32,48,64,80].map(y => <line key={y} x1="96" y1={y} x2={96-y} y2="0" stroke="#2A2A2A" strokeWidth="1.5"/>)}
                  </svg>
                </div>
                <h1 className="font-black text-[30px] leading-tight tracking-wider text-gold uppercase drop-shadow-md">
                  {config?.store_name || 'SOU FANÁTICO'}
                </h1>
                <p className="font-bold text-[11px] text-text uppercase tracking-[4px] mt-1 opacity-95">
                  CAMISAS DE TIME
                </p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-[44px] z-10">
                <div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gold shadow-[0_4px_16px_rgba(0,0,0,0.7)] flex items-center justify-center">
                  <img
                    src={config?.profile_image || 'https://via.placeholder.com/88x88/1A1A1A/D4A017?text=D'}
                    alt={config?.owner_name || 'Diego'}
                    className="w-full h-full object-cover rounded-full bg-card"
                  />
                </div>
              </div>
            </section>

            <section className="px-4 text-center mt-[52px]">
              <h2 className="font-bold text-[20px] text-text tracking-tight">
                {config?.store_name || 'SOU FANÁTICO'} | Camisas De Time
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Check className="w-3.5 h-3.5 text-gold" />
                <span className="font-medium text-[14px] text-muted">{config?.owner_name || 'Diego'}</span>
              </div>
              <p className="italic text-[13px] text-muted mt-1.5">
                "{config?.tagline || 'Aqui seu manto é sagrado!'}"
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="bg-elevated border border-gold text-gold font-medium text-[11px] px-[14px] py-[6px] rounded-[20px]">
                  Premium 1.1
                </span>
                <span className="bg-elevated border border-border text-text font-medium text-[11px] px-[14px] py-[6px] rounded-[20px]">
                  Nacional 1ª Linha
                </span>
              </div>
              <div className="w-[60%] h-px bg-border mx-auto mt-5" />
              <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[22px] text-gold">150+</span>
                  <span className="text-[11px] text-muted mt-0.5">camisas vendidas</span>
                </div>
                <div className="flex flex-col items-center border-x border-border/60 px-1">
                  <span className="font-bold text-[22px] text-gold">{teams.length - 1 || 6}</span>
                  <span className="text-[11px] text-muted mt-0.5">times disponíveis</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="font-bold text-[22px] text-gold">4.9</span>
                  </div>
                  <span className="text-[11px] text-muted mt-0.5">avaliação</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-left mt-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-stock" />
                  <span className="font-bold text-[14px] text-text">Compra segura</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {['Envio para todo o Brasil', 'Fotos reais do produto', `Atendimento direto com o ${config?.owner_name || 'Diego'}`].map(t => (
                    <li key={t} className="text-[12px] text-muted flex items-center gap-2">
                      <span className="text-stock text-xs font-bold">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setShowCatalog(true)}
                className="w-full h-12 mt-5 bg-gold hover:bg-gold-hover text-bg font-bold text-[15px] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(212,160,23,0.3)] transition-all active:scale-[0.99]"
              >
                Ver Catálogo de Camisas
              </button>
            </section>
          </main>

          <footer className="sticky bottom-0 h-[56px] bg-card border-t border-border px-4 py-2 flex items-center z-20">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="w-full h-10 bg-whatsapp hover:brightness-110 text-white font-bold text-[14px] rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
              <WhatsAppIcon />
              <span>Falar com {config?.owner_name || 'Diego'}</span>
            </a>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-bg flex flex-col relative pb-[90px]">
        <header className="sticky top-0 z-50 bg-bg">
          <nav className="h-[56px] px-4 flex items-center justify-between border-b border-border/40">
            <button onClick={() => setShowCatalog(false)} className="w-9 h-9 flex items-center text-text hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-[17px] font-bold text-text">Catálogo</h1>
            <div className="w-9" />
          </nav>
          <div className="h-[64px] bg-card px-4 py-3 flex items-center border-b border-border">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold shrink-0 bg-elevated">
              <img src={config?.profile_image || 'https://via.placeholder.com/36x36/1A1A1A/D4A017?text=D'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="ml-2.5 flex flex-col">
              <span className="text-[14px] font-bold text-text leading-tight">{config?.store_name || 'SOU FANÁTICO'}</span>
              <span className="text-[11px] text-muted leading-tight mt-0.5">{teams.length - 1} times • {products.length} camisas disponíveis</span>
            </div>
          </div>
        </header>

        <main className="px-4 flex-1 flex flex-col">
          <div className="mt-3 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por time ou camisa..."
              className="w-full h-[44px] pl-10 pr-3 rounded-[10px] bg-card border border-border text-text placeholder-muted text-[14px] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="mt-3 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
            {teams.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`shrink-0 px-[18px] py-2 rounded-[20px] text-[13px] transition-all active:scale-95 ${
                  filter === t ? 'bg-gold text-bg font-bold' : 'bg-elevated text-muted font-medium border border-border/50 hover:text-text'
                }`}>
                {t}
              </button>
            ))}
          </div>

          <div className="mt-2 text-left">
            <span className="text-[12px] text-muted">{filtered.length} camisas encontradas</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <Link key={p.id} to={`/produto/${p.id}`}
                className="bg-card rounded-xl overflow-hidden border border-border flex flex-col hover:border-gold/40 transition-colors">
                <div className="relative w-full aspect-square bg-elevated overflow-hidden">
                  <img src={p.image_url || 'https://via.placeholder.com/200x200/242424/999999?text=Camisa'} alt={p.name} className="w-full h-full object-cover" />
                  {p.is_new && (
                    <span className="absolute top-0 right-0 bg-gold text-bg font-bold text-[9px] px-2 py-[3px] rounded-bl-lg tracking-wider">NOVO</span>
                  )}
                </div>
                <div className="p-[10px_12px_12px] flex flex-col flex-1">
                  <span className="text-[10px] font-bold text-gold tracking-[1px] uppercase">{p.team}</span>
                  <h2 className="text-[14px] font-bold text-text mt-0.5 leading-tight truncate">{p.name}</h2>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-[17px] font-bold text-gold leading-none">R$ {p.price}</span>
                    {p.old_price && <span className="text-[12px] text-muted line-through leading-none">R$ {p.old_price}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-1 flex-wrap">
                    {p.sizes.map(s => (
                      <span key={s} className="bg-elevated text-text font-medium text-[10px] px-2 py-[3px] rounded-md">{s}</span>
                    ))}
                  </div>
                  <div className="mt-2">
                    {p.in_stock ? (
                      <span className="inline-flex items-center gap-1 border border-stock text-stock font-medium text-[10px] px-2.5 py-1 rounded-md">
                        <Check className="w-2.5 h-2.5" /> Pronta entrega
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-order text-order font-medium text-[10px] px-2.5 py-1 rounded-md">
                        <Clock className="w-2.5 h-2.5" /> Previsão: {p.delivery_date ? new Date(p.delivery_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'A definir'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6" />
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-[390px] h-[56px] bg-card border-t border-border px-4 py-2 flex items-center pointer-events-auto">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="w-full h-10 bg-whatsapp hover:brightness-110 text-white font-bold text-[14px] rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
              <WhatsAppIcon />
              <span>Pedir via WhatsApp</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
      <path d="M12.031 2C6.502 2 2.012 6.486 2.012 12.008c0 1.838.498 3.567 1.365 5.061L2 22l5.086-1.334a9.96 9.96 0 004.945 1.303h.004c5.526 0 10.016-4.488 10.016-10.01 0-2.673-1.04-5.184-2.934-7.076C17.218 3.04 14.707 2 12.031 2zm5.82 14.184c-.244.686-1.218 1.29-1.748 1.332-.486.038-1.121.054-3.606-.976-2.115-.877-3.486-3.041-3.593-3.181-.104-.143-.85-1.134-.85-2.164 0-1.028.536-1.536.728-1.745.19-.208.416-.26.554-.26.139 0 .278.001.399.007.128.006.3.04.467.442.174.417.592 1.442.645 1.547.052.104.087.226.017.365-.07.139-.104.226-.208.347-.104.122-.22.27-.313.365-.104.104-.213.218-.092.427.122.208.541.894 1.161 1.448.799.713 1.472.934 1.681 1.038.209.104.331.087.452-.052.122-.139.521-.608.66-.817.139-.209.278-.174.469-.104.191.07 1.218.574 1.427.678.209.104.348.156.399.243.053.087.053.504-.191 1.19z" />
    </svg>
  )
}
