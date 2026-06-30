import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { products, categories } from '../data/mock'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'

const PRICE_MIN = 0
const PRICE_MAX = 30000
const PRICE_STEP = 500

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
}

function fmt(n: number) { return n.toLocaleString('ru-RU') }

function PriceFilter({
  value,
  onChange,
}: {
  value: [number, number]
  onChange: (v: [number, number]) => void
}) {
  const [lo, hi] = value
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'lo' | 'hi' | null>(null)

  // Refs для актуальных значений внутри глобальных listener'ов
  const loR = useRef(lo)
  const hiR = useRef(hi)
  const onChangeR = useRef(onChange)
  useEffect(() => { loR.current = lo }, [lo])
  useEffect(() => { hiR.current = hi }, [hi])
  useEffect(() => { onChangeR.current = onChange }, [onChange])

  // Строковые состояния инпутов — всегда показывают текущее значение
  const [loStr, setLoStr] = useState(fmt(lo))
  const [hiStr, setHiStr] = useState(fmt(hi))
  const prevLo = useRef(lo)
  const prevHi = useRef(hi)
  useEffect(() => {
    if (lo !== prevLo.current) { prevLo.current = lo; setLoStr(fmt(lo)) }
  }, [lo])
  useEffect(() => {
    if (hi !== prevHi.current) { prevHi.current = hi; setHiStr(fmt(hi)) }
  }, [hi])

  const getVal = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return PRICE_MIN
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round((PRICE_MIN + pct * (PRICE_MAX - PRICE_MIN)) / PRICE_STEP) * PRICE_STEP
  }, [])

  const startDrag = useCallback((clientX: number) => {
    const v = getVal(clientX)
    const dLo = Math.abs(v - loR.current)
    const dHi = Math.abs(v - hiR.current)
    // Если одинаково — тянем тот, в чью сторону двигаемся
    dragging.current = dLo <= dHi ? 'lo' : 'hi'
    const lo = loR.current, hi = hiR.current
    if (dragging.current === 'lo') onChangeR.current([Math.max(PRICE_MIN, Math.min(v, hi - PRICE_STEP)), hi])
    else onChangeR.current([lo, Math.min(PRICE_MAX, Math.max(v, lo + PRICE_STEP))])
  }, [getVal])

  useEffect(() => {
    const move = (clientX: number) => {
      if (!dragging.current) return
      const v = getVal(clientX)
      const lo = loR.current, hi = hiR.current
      if (dragging.current === 'lo') onChangeR.current([Math.max(PRICE_MIN, Math.min(v, hi - PRICE_STEP)), hi])
      else onChangeR.current([lo, Math.min(PRICE_MAX, Math.max(v, lo + PRICE_STEP))])
    }
    const onMM = (e: MouseEvent) => move(e.clientX)
    const onTM = (e: TouchEvent) => { if (!dragging.current) return; e.preventDefault(); move(e.touches[0].clientX) }
    const onUp = () => { dragging.current = null }

    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTM, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('touchend', onUp)
    }
  }, [getVal])

  const commitLo = () => {
    const v = Math.max(PRICE_MIN, Math.min(parseInt(loStr.replace(/\D/g, ''), 10) || PRICE_MIN, hi - PRICE_STEP))
    onChange([v, hi])
    setLoStr(fmt(v))
  }
  const commitHi = () => {
    const v = Math.min(PRICE_MAX, Math.max(parseInt(hiStr.replace(/\D/g, ''), 10) || PRICE_MAX, lo + PRICE_STEP))
    onChange([lo, v])
    setHiStr(fmt(v))
  }

  const pctLo = ((lo - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const pctHi = ((hi - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100

  const inputCls = 'w-[72px] bg-transparent outline-none font-body text-sm text-charcoal text-center border-b border-outline-variant/60 focus:border-charcoal transition-colors pb-0.5'

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Инпуты */}
      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-outline mr-1">Цена</span>
        <span className="font-body text-xs text-outline">от</span>
        <input
          type="text" inputMode="numeric"
          value={loStr}
          onChange={e => setLoStr(e.target.value)}
          onFocus={e => e.target.select()}
          onBlur={commitLo}
          onKeyDown={e => e.key === 'Enter' && commitLo()}
          className={inputCls}
        />
        <span className="font-body text-xs text-outline">до</span>
        <input
          type="text" inputMode="numeric"
          value={hiStr}
          onChange={e => setHiStr(e.target.value)}
          onFocus={e => e.target.select()}
          onBlur={commitHi}
          onKeyDown={e => e.key === 'Enter' && commitHi()}
          className={inputCls}
        />
        <span className="font-body text-xs text-outline">₽</span>
      </div>

      {/* Кастомный слайдер — без z-index проблем */}
      <div
        ref={trackRef}
        className="relative h-5 flex items-center select-none cursor-pointer"
        onMouseDown={e => startDrag(e.clientX)}
        onTouchStart={e => startDrag(e.touches[0].clientX)}
      >
        <div className="absolute w-full h-px rounded-full bg-outline-variant/40" />
        <div className="absolute h-px rounded-full bg-charcoal"
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }} />
        <div className="absolute w-4 h-4 rounded-full bg-charcoal"
          style={{ left: `calc(${pctLo}% - 8px)`, border: '2px solid #fbf9f8', boxShadow: '0 1px 5px rgba(0,0,0,0.25)' }} />
        <div className="absolute w-4 h-4 rounded-full bg-charcoal"
          style={{ left: `calc(${pctHi}% - 8px)`, border: '2px solid #fbf9f8', boxShadow: '0 1px 5px rgba(0,0,0,0.25)' }} />
      </div>
    </div>
  )
}

// ── Каталог ───────────────────────────────────────────
export default function Catalog() {
  const [searchParams] = useSearchParams()
  const catParam = searchParams.get('cat') || 'all'
  const [activeCategory, setActiveCategory] = useState(catParam)
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX])

  useEffect(() => {
    setActiveCategory(catParam)
  }, [catParam])

  const priceActive = priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX

  const filtered = (activeCategory === 'all' ? products : products.filter(p => p.categoryId === activeCategory))
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-28 md:pt-36 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="label-caps text-sage mb-3">Каталог</p>
          <h1 className="font-heading text-4xl md:text-6xl text-charcoal mb-4" style={{ letterSpacing: '-0.02em' }}>
            Коллекция
          </h1>
          <p className="font-body text-sm md:text-base text-outline max-w-lg font-light">
            Цветочные композиции, созданные с безупречным мастерством
          </p>
        </motion.div>
      </div>

      {/* Фильтры */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pb-10 space-y-4">
        {/* Категории */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-3 overflow-x-auto scrollbar-none pb-1"
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 font-body text-xs md:text-sm px-5 py-2.5 rounded-full border transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-transparent text-outline border-outline-variant/50 hover:border-outline'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Фильтр по цене */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="flex items-center gap-2"
        >
          <PriceFilter value={priceRange} onChange={setPriceRange} />

          <AnimatePresence>
            {priceActive && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-outline-variant/20 hover:bg-outline-variant/40 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-charcoal" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pb-20 md:pb-32">
        <p className="font-body text-xs text-outline-variant mb-8">
          {filtered.length} {filtered.length === 1 ? 'композиция' : filtered.length < 5 ? 'композиции' : 'композиций'}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                custom={i}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h2 className="font-heading text-2xl text-outline-variant mb-3">Ничего не найдено</h2>
            <p className="font-body text-sm text-outline mb-6">Попробуйте другую категорию или диапазон цен</p>
            <button
              onClick={() => { setActiveCategory('all'); setPriceRange([PRICE_MIN, PRICE_MAX]) }}
              className="font-body text-sm text-charcoal underline underline-offset-4 cursor-pointer hover:text-outline transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Promise bar */}
      <div className="border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-12 flex flex-col md:flex-row gap-6 md:gap-16 justify-center items-center">
          {['Бесплатная доставка от 10 000 ₽', 'Гарантия свежести 7+ дней', 'Премиальная упаковка'].map((text, i, arr) => (
            <div key={text} className="flex items-center gap-6 md:gap-16">
              <span className="font-body text-sm text-outline tracking-wide">{text}</span>
              {i < arr.length - 1 && <span className="hidden md:block w-px h-4 bg-outline-variant/50" />}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
