import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, StoreConfig } from '../lib/types'
import { Search, ShieldCheck, Star, Check, Clock } from 'lucide-react'

const CATEGORIES = ['Todos', 'Nacional', 'Internacional', 'Seleção']

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [bannerIdx, setBannerIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProducts(data) })
    supabase.from('store_config').select('*').single()
      .then(({ data }) => { if (data) setConfig(data) })
  }, [])

  const banners = config?.banner_images?.length ? config.banner_images : []

  useEffect(() => {
    if (banners.length <= 1) return
    intervalRef.current = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [banners.length])

  const filtered = products.filter(p => {
    if (filter !== 'Todos' && p.category !== filter) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.team.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const whatsappUrl = config ? `https://wa.me/${config.whatsapp}` : '#'

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-bg flex flex-col relative pb-[72px]">

        {/* === HEADER WHATSAPP-STYLE === */}
        <section className="relative">
          {/* Banner / Cover com carrossel */}
          <div className="h-[200px] w-full relative overflow-hidden bg-card">
            {banners.length > 0 ? banners.map((url, i) => (
              <img key={i} src={url} alt=""
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === bannerIdx ? 1 : 0 }} />
            )) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ backgroundImage: 'radial-gradient(circle at center, #242424 0%, #1A1A1A 100%)' }}>
                <h1 className="font-black text-[28px] tracking-wider text-gold/30 uppercase">SOU FANÁTICO</h1>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
            {banners.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {banners.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === bannerIdx ? 'bg-gold w-4' : 'bg-white/40'}`} />
                ))}
              </div>
            )}
          </div>

          {/* Avatar grande sobrepondo o banner */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[48px] z-10">
            <div className="w-[96px] h-[96px] rounded-full p-[3px] bg-bg shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
              <div className="w-full h-full rounded-full border-[2.5px] border-gold overflow-hidden bg-card">
                <img
                  src={config?.profile_image || 'https://via.placeholder.com/96x96/1A1A1A/D4A017?text=D'}
                  alt={config?.owner_name || 'Diego'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* === PERFIL === */}
        <section className="px-5 text-center mt-[56px]">
          <h2 className="font-bold text-[18px] text-text tracking-tight leading-tight">
            SOU FANÁTICO | Camisas De Time
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Check className="w-3 h-3 text-gold" />
            <span className="font-medium text-[13px] text-muted">{config?.owner_name || 'Diego'}</span>
          </div>
          <p className="italic text-[12px] text-muted/80 mt-1">
            "{config?.tagline || 'Aqui seu manto é sagrado!'}"
          </p>

          <div className="flex items-center justify-center gap-2 mt-2.5">
            <span className="bg-elevated border border-gold/60 text-gold font-medium text-[10px] px-3 py-[5px] rounded-full">
              Premium 1.1
            </span>
            <span className="bg-elevated border border-border text-text font-medium text-[10px] px-3 py-[5px] rounded-full">
              Nacional 1ª Linha
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-[20px] text-gold leading-none">150+</span>
              <span className="text-[10px] text-muted mt-1">vendidas</span>
            </div>
            <div className="w-px h-8 bg-border/60" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-[20px] text-gold leading-none">{new Set(products.map(p => p.team)).size || 6}</span>
              <span className="text-[10px] text-muted mt-1">times</span>
            </div>
            <div className="w-px h-8 bg-border/60" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-gold fill-gold" />
                <span className="font-bold text-[20px] text-gold leading-none">4.9</span>
              </div>
              <span className="text-[10px] text-muted mt-1">avaliação</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 py-3 border-y border-border/40">
            <ShieldCheck className="w-4 h-4 text-stock shrink-0" />
            <div className="flex items-center gap-3 text-[11px] text-muted">
              <span>Envio Brasil</span>
              <span className="text-border/60">•</span>
              <span>Fotos reais</span>
              <span className="text-border/60">•</span>
              <span>Atendimento direto</span>
            </div>
          </div>
        </section>

        {/* === BUSCA + FILTROS POR CATEGORIA === */}
        <section className="px-4 mt-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por time ou camisa..."
              className="w-full h-[42px] pl-9 pr-3 rounded-xl bg-card border border-border text-text placeholder-muted text-[13px] focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`shrink-0 px-4 py-[7px] rounded-full text-[12px] transition-all active:scale-95 ${
                  filter === c ? 'bg-gold text-bg font-bold' : 'bg-elevated text-muted font-medium border border-border/50 hover:text-text'
                }`}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-muted mt-2">{filtered.length} camisas encontradas</p>
        </section>

        {/* === GRID DE PRODUTOS === */}
        <section className="px-4 mt-3 flex-1">
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map(p => (
              <Link key={p.id} to={`/produto/${p.id}`}
                className="bg-card rounded-xl overflow-hidden border border-border flex flex-col hover:border-gold/40 transition-colors">
                <div className="relative w-full aspect-square bg-elevated overflow-hidden">
                  <img src={p.image_url || 'https://via.placeholder.com/200x200/242424/999999?text=Camisa'} alt={p.name} className="w-full h-full object-cover" />
                  {p.is_new && (
                    <span className="absolute top-0 right-0 bg-gold text-bg font-bold text-[9px] px-2 py-[3px] rounded-bl-lg tracking-wider">NOVO</span>
                  )}
                </div>
                <div className="p-[10px_11px_11px] flex flex-col flex-1">
                  <span className="text-[9px] font-bold text-gold tracking-[1px] uppercase">{p.team}</span>
                  <h2 className="text-[13px] font-bold text-text mt-0.5 leading-tight truncate">{p.name}</h2>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="text-[16px] font-bold text-gold leading-none">R$ {p.price}</span>
                    {p.old_price && <span className="text-[11px] text-muted line-through leading-none">R$ {p.old_price}</span>}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                    {p.sizes.map(s => (
                      <span key={s} className="bg-elevated text-text font-medium text-[9px] px-1.5 py-[2px] rounded">{s}</span>
                    ))}
                  </div>
                  <div className="mt-1.5">
                    {p.in_stock ? (
                      <span className="inline-flex items-center gap-1 border border-stock text-stock font-medium text-[9px] px-2 py-[3px] rounded">
                        <Check className="w-2.5 h-2.5" /> Pronta entrega
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 border border-order text-order font-medium text-[9px] px-2 py-[3px] rounded">
                        <Clock className="w-2.5 h-2.5" /> {p.delivery_date ? new Date(p.delivery_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'A definir'}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* === FOOTER WHATSAPP === */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] bg-card/95 backdrop-blur-sm border-t border-border px-4 py-2.5 pointer-events-auto">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="w-full h-11 bg-whatsapp hover:brightness-110 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-[0_-2px_12px_rgba(0,0,0,0.3)]">
              <WhatsAppIcon />
              <span>Falar com {config?.owner_name || 'Diego'}</span>
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
