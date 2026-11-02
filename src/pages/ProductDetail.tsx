import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product, StoreConfig } from '../lib/types'
import { ChevronLeft, Share2, Check, Clock } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    if (!id) return
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setProduct(data)
          if (data.sizes.length > 0) setSelectedSize(data.sizes[0])
        }
      })
    supabase.from('store_config').select('*').single()
      .then(({ data }) => { if (data) setConfig(data) })
  }, [id])

  if (!product) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-muted">Carregando...</div>
    </div>
  )

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse na camisa ${product.team} - ${product.name}, tamanho ${selectedSize}. Vi no catálogo online.`
  )
  const whatsappUrl = `https://wa.me/${config?.whatsapp || '5518997136772'}?text=${whatsappMsg}`

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen bg-bg flex flex-col relative">
        <header className="sticky top-0 z-40 bg-bg h-[56px] px-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center text-text hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="font-bold text-[17px] text-text">Detalhes</h1>
          <button className="w-8 h-8 flex items-center justify-end text-text hover:opacity-80">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 pb-[110px]">
          <div className="w-full h-[390px] bg-card overflow-hidden">
            <img src={product.image_url || 'https://via.placeholder.com/390x390/242424/999999?text=Camisa'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            <span className="w-5 h-1.5 bg-gold rounded-full" />
            <span className="w-1.5 h-1.5 bg-border rounded-full" />
            <span className="w-1.5 h-1.5 bg-border rounded-full" />
          </div>

          <section className="px-4 mt-4">
            <div className="text-gold font-bold text-[11px] uppercase tracking-[2px]">{product.team}</div>
            <h2 className="font-bold text-[22px] text-text leading-tight mt-1">{product.name} | {product.type}</h2>
            <p className="text-[14px] text-muted mt-1">Camisa oficial temporada {product.season}</p>
          </section>

          <section className="px-4 mt-4">
            <div className="bg-card rounded-xl p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-black text-[28px] text-gold leading-none">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                {product.old_price && (
                  <span className="text-[16px] text-muted line-through leading-none">R$ {product.old_price.toFixed(2).replace('.', ',')}</span>
                )}
              </div>
              {product.old_price && (
                <p className="font-medium text-[12px] text-stock mt-1">
                  ↓ Economia de R$ {(product.old_price - product.price).toFixed(2).replace('.', ',')}
                </p>
              )}
            </div>
          </section>

          <section className="px-4 mt-4">
            <div className="font-bold text-[11px] text-muted uppercase tracking-[1px]">TAMANHO</div>
            <div className="flex items-center gap-2 mt-2">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)}
                  className={`w-11 h-11 rounded-lg font-bold text-[14px] flex items-center justify-center transition-colors ${
                    selectedSize === s ? 'bg-gold border border-gold text-bg' : 'bg-elevated border border-border text-text'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </section>

          {product.in_stock ? (
            <section className="px-4 mt-4">
              <div className="bg-card border border-stock rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <Check className="w-[18px] h-[18px] text-stock" />
                  <span className="font-bold text-[14px] text-stock">Em estoque — Pronta entrega</span>
                </div>
                <p className="text-[12px] text-muted mt-1.5">Envio em até 3 dias úteis após confirmação</p>
              </div>
            </section>
          ) : (
            <section className="px-4 mt-4">
              <div className="bg-card border border-order rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-[18px] h-[18px] text-order" />
                  <span className="font-bold text-[14px] text-order">Sob encomenda</span>
                </div>
                <p className="font-bold text-[13px] text-text mt-1.5">
                  Previsão de entrega: {product.delivery_date ? new Date(product.delivery_date).toLocaleDateString('pt-BR') : 'A definir'}
                </p>
                <p className="text-[12px] text-muted mt-1">Produto importado — o prazo pode variar alguns dias</p>
              </div>
            </section>
          )}

          <div className="mx-4 mt-4 border-b border-border" />

          <section className="px-4 mt-4">
            <div className="font-bold text-[11px] text-muted uppercase tracking-[1px]">DETALHES</div>
            <div className="flex flex-col gap-2.5 mt-2.5">
              {[
                ['Tipo', product.type],
                ['Temporada', product.season],
                ['Qualidade', product.quality],
                ['Material', product.material],
                ['Time', product.team],
              ].map(([label, value], i, arr) => (
                <div key={label} className={`flex justify-between items-center py-1 ${i < arr.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <span className="text-[13px] text-muted">{label}</span>
                  <span className="font-medium text-[13px] text-text">{value}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-50 bg-card border-t border-border p-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[16px] text-gold">Total: R$ {product.price.toFixed(2).replace('.', ',')}</span>
            <span className="font-medium text-[14px] text-text">Tam: {selectedSize}</span>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="w-full h-12 mt-2 bg-whatsapp hover:brightness-110 text-white font-bold text-[15px] rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 2C6.502 2 2.012 6.486 2.012 12.008c0 1.838.498 3.567 1.365 5.061L2 22l5.086-1.334a9.96 9.96 0 004.945 1.303h.004c5.526 0 10.016-4.488 10.016-10.01 0-2.673-1.04-5.184-2.934-7.076C17.218 3.04 14.707 2 12.031 2zm5.82 14.184c-.244.686-1.218 1.29-1.748 1.332-.486.038-1.121.054-3.606-.976-2.115-.877-3.486-3.041-3.593-3.181-.104-.143-.85-1.134-.85-2.164 0-1.028.536-1.536.728-1.745.19-.208.416-.26.554-.26.139 0 .278.001.399.007.128.006.3.04.467.442.174.417.592 1.442.645 1.547.052.104.087.226.017.365-.07.139-.104.226-.208.347-.104.122-.22.27-.313.365-.104.104-.213.218-.092.427.122.208.541.894 1.161 1.448.799.713 1.472.934 1.681 1.038.209.104.331.087.452-.052.122-.139.521-.608.66-.817.139-.209.278-.174.469-.104.191.07 1.218.574 1.427.678.209.104.348.156.399.243.053.087.053.504-.191 1.19z" />
            </svg>
            <span>Pedir no WhatsApp</span>
          </a>
        </footer>
      </div>
    </div>
  )
}
